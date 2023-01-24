
import { toggleIndeterminateProgress } from '../common/progressindicator.js';
import { callStandaloneContract } from '../near/near.js';
import { getCIDForFileData } from './cid.js';

customElements.define('nearfs-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <h3>Upload file to NEARFS</h3>
            <p><input type="file" id="fileinput"></p>
            <p><mwc-button raised id="uploadFileButton">Upload</mwc-button></p>
            <div>
            <a id="downloadlink" target="_blank"></a>
            </div>
        `;
        const fileinput = this.shadowRoot.getElementById('fileinput');
        const uploadFileButton = this.shadowRoot.getElementById('uploadFileButton');
        uploadFileButton.addEventListener('click', (e) => {
            toggleIndeterminateProgress(true);
            const file = fileinput.files[0];
            let reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = new Uint8Array(e.target.result);

                const cid = await getCIDForFileData(fileData);

                const downloadUrl = `https://ipfs.web4.near.page/ipfs/${cid}?filename=${file.name}`;
                

                const response = await fetch(downloadUrl);
                if (response.status == 404) {
                    await callStandaloneContract(null, 'fs_store', fileData);
                }

                const downloadLink = this.shadowRoot.getElementById('downloadlink');
                downloadLink.href = downloadUrl;
                downloadLink.innerHTML = downloadUrl;

                toggleIndeterminateProgress(false);
            };
            reader.readAsArrayBuffer(file);
        });
    }
});