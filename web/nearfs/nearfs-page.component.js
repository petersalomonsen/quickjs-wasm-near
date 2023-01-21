
import {getCIDForFileData} from './cid.js';

customElements.define('nearfs-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <input type="file" id="fileinput">
        `;
        const fileinput = this.shadowRoot.getElementById('fileinput');
        fileinput.addEventListener('change', (e) => {
            const file = fileinput.files[0];
            let reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = new Uint8Array(e.target.result);
                
                console.log(await getCIDForFileData(fileData));
            };
            reader.readAsArrayBuffer(file);
        });
    }
});