import { getNearConfig, createWalletConnection, callStandaloneContract, viewStandaloneContract, getTargetContractName } from '../near/near.js';
import { toggleIndeterminateProgress } from '../common/progressindicator.js';

class CallContractStandalonePageComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});        
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('callcontractstandalone-page.component.html', import.meta.url)).then(r => r.text());
        this.attachStyleSheet(new URL('callcontract-page.component.css', import.meta.url));
        const callcontractbutton = this.shadowRoot.getElementById('callcontractbutton');
        const contractnameinput = this.shadowRoot.getElementById('contractnameinput');

        const methodnameinput = this.shadowRoot.getElementById('methodnameinput');
        const argsinput = this.shadowRoot.getElementById('argsinput');
        const contractOutputArea = this.shadowRoot.querySelector('#contractoutput');
        callcontractbutton.addEventListener('click', async () => {
            toggleIndeterminateProgress(true);
            try {
                const result = await callStandaloneContract(contractnameinput.value, methodnameinput.value, argsinput.value ? JSON.parse(argsinput.value) : '', this.shadowRoot.querySelector('#depositinput').value, this.shadowRoot.querySelector('#gasinput').value);
                contractOutputArea.textContent = `
${result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n')}
${result.status.SuccessValue ? atob(result.status.SuccessValue) : ''}

${JSON.stringify(result, null, 1)}`;
            } catch(e) {
                contractOutputArea.textContent = e.message;
            }
            toggleIndeterminateProgress(false);
        });
        const viewcontractmethodbutton = this.shadowRoot.getElementById('viewcontractmethodbutton');
        viewcontractmethodbutton.addEventListener('click', async () => {
            toggleIndeterminateProgress(true);
            try {
                const result = await viewStandaloneContract(contractnameinput.value, methodnameinput.value, argsinput.value ? JSON.parse(argsinput.value) : '');
                contractOutputArea.textContent = JSON.stringify(result);
            } catch(e) {
                contractOutputArea.textContent = e.message;
            }
            toggleIndeterminateProgress(false);
        });

        const accountId = (await createWalletConnection()).account().accountId;
        contractnameinput.value = await getTargetContractName();
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

                contractOutputArea.textContent = `
${result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n')}\n
${result.status.SuccessValue ? atob(result.status.SuccessValue) : ''}


${JSON.stringify(result)}                
                `;
        }
        
    }
}

customElements.define('callcontractstandalone-page', CallContractStandalonePageComponent)