import { callJSContract, walletConnection } from '../near.js';
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
        callcontractbutton.addEventListener('click', async () => {
            toggleIndeterminateProgress(true);
            const contractOutputArea = this.shadowRoot.querySelector('#contractoutput');
            const result = await callJSContract(contractnameinput.value, methodnameinput.value, argsinput.value);
            contractOutputArea.innerHTML = `
                ${result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n')}<br />
                ${result.status.SuccessValue ? atob(result.status.SuccessValue) : ''}`;

            toggleIndeterminateProgress(false);
        });

        (async () => {
            contractnameinput.value = (await walletConnection).account().accountId;
        })();
    }
}

customElements.define('callcontract-page', CallContractPageComponent)