import { toggleIndeterminateProgress } from "../common/progressindicator.js";
import { deleteSubContract } from "../near/near.js";

customElements.define('deletecontract-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<mwc-button icon="delete" id="deletecontractbutton">Delete contract</mwc-button>
        <mwc-dialog id="delete-contract-dialog" heading="Really delete contract and account?">
            <div>This will delete the contract and the account.</div>
            <mwc-button slot="primaryAction" dialogAction="delete">
                Delete
            </mwc-button>
            <mwc-button slot="secondaryAction" dialogAction="cancel">
                Cancel
            </mwc-button>
        </mwc-dialog>
        `;
        this.shadowRoot.getElementById('deletecontractbutton').addEventListener('click', async () => {
            const deleteContractDialog = this.shadowRoot.getElementById('delete-contract-dialog');
            deleteContractDialog.setAttribute('open', 'true');
            if (await new Promise(resolve => {
                deleteContractDialog.querySelectorAll('mwc-button').forEach(b => b.addEventListener('click', (e) => {
                    resolve(e.target.getAttribute('dialogaction'));
                }))
            }) == 'delete') {
                toggleIndeterminateProgress(true);
                await deleteSubContract();
                toggleIndeterminateProgress(false);
            }
        });
    }
});