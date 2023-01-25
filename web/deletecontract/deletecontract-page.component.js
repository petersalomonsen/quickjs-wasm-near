import { toggleIndeterminateProgress } from "../common/progressindicator.js";
import { deleteSubContract, getTargetContractName } from "../near/near.js";

customElements.define('deletecontract-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <p><span id="targetContractNameSpan"></span></p>
        <mwc-button icon="delete" id="deletecontractbutton">Delete contract</mwc-button>
        <mwc-dialog id="delete-contract-dialog" heading="Really delete contract and account?">
            <div><p>This will delete the contract and the account</p>
            <p><span id="dialogTargetContractNameSpan"></span></p></div>
            <mwc-button slot="primaryAction" dialogAction="delete">
                Delete
            </mwc-button>
            <mwc-button slot="secondaryAction" dialogAction="cancel">
                Cancel
            </mwc-button>
        </mwc-dialog>
        <mwc-snackbar id="snackbar" labelText="">
            <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
        </mwc-snackbar>
        `;
        getTargetContractName().then(targetContractName => {
            this.shadowRoot.getElementById('targetContractNameSpan').innerHTML = targetContractName;
            this.shadowRoot.getElementById('dialogTargetContractNameSpan').innerHTML = targetContractName;
        });
        this.shadowRoot.getElementById('deletecontractbutton').addEventListener('click', async () => {
            const deleteContractDialog = this.shadowRoot.getElementById('delete-contract-dialog');
            deleteContractDialog.setAttribute('open', 'true');
            if (await new Promise(resolve => {
                deleteContractDialog.querySelectorAll('mwc-button').forEach(b => b.addEventListener('click', (e) => {
                    resolve(e.target.getAttribute('dialogaction'));
                }))
            }) == 'delete') {
                toggleIndeterminateProgress(true);
                const snackbar = this.shadowRoot.getElementById('snackbar');
                try {
                    await deleteSubContract();
                    snackbar.labelText="Contract deleted";
                } catch (e) {
                    snackbar.labelText=e.message;
                }
                snackbar.show();
                toggleIndeterminateProgress(false);
            }
        });
    }
});