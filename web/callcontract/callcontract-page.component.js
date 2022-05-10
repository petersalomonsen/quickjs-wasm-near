import { callJSContract, getNearConfig, walletConnection } from '../near/near.js';
import { toggleIndeterminateProgress } from '../common/progressindicator.js';

class CallContractPageComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});        
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('callcontract-page.component.html', import.meta.url)).then(r => r.text());
        this.attachStyleSheet(new URL('callcontract-page.component.css', import.meta.url));
        const callcontractbutton = this.shadowRoot.getElementById('callcontractbutton');
        const contractnameinput = this.shadowRoot.getElementById('contractnameinput');

        const methodnameinput = this.shadowRoot.getElementById('methodnameinput');
        const argsinput = this.shadowRoot.getElementById('argsinput');
        const contractOutputArea = this.shadowRoot.querySelector('#contractoutput');
        callcontractbutton.addEventListener('click', async () => {
            toggleIndeterminateProgress(true);
            try {
                const result = await callJSContract(contractnameinput.value, methodnameinput.value, argsinput.value, this.shadowRoot.querySelector('#depositinput').value);
                contractOutputArea.textContent = `
${result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n')}
${result.status.SuccessValue ? atob(result.status.SuccessValue) : ''}`;
            } catch(e) {
                contractOutputArea.textContent = e.message;
            }
            toggleIndeterminateProgress(false);
        });

        const accountId = (await walletConnection).account().accountId;
        contractnameinput.value = accountId;
        const transactionIdMatch = location.search.match(/transactionHashes=([a-zA-Z0-9]+)/);
        if (transactionIdMatch) {
            const txhash = transactionIdMatch[1];
            const result = (await fetch(getNearConfig().nodeUrl, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "jsonrpc": "2.0",
                        "id": "dontcare",
                        "method": "EXPERIMENTAL_tx_status",
                        "params": [txhash, accountId]
                    })
                }).then(r => r.json())).result;

                contractOutputArea.innerHTML = `${result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n')}\n
${result.status.SuccessValue ? atob(result.status.SuccessValue) : ''}`;
        }
        
    }
}

customElements.define('callcontract-page', CallContractPageComponent)