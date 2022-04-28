import './code-editor.component.js';
import { deployJScontract } from '../near.js';
import { compileToByteCode } from '../compiler/compilerutils.js'
import { toggleIndeterminateProgress } from '../common/progressindicator.js';

class CodePageComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});        
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('code-page.component.html', import.meta.url)).then(r => r.text());
        const sourcecodeeditor = this.shadowRoot.getElementById('sourcecodeeditor');
        const lastSavedSourceCode = localStorage.getItem('lastSavedSourceCode');
        sourcecodeeditor.value = lastSavedSourceCode ? lastSavedSourceCode : `export function hello() {
            env.log("Hello Near");
        }`;

        const deploybutton = this.shadowRoot.getElementById('deploybutton');
        
        deploybutton.addEventListener('click', async () => {
            const deployContractDialog = this.shadowRoot.getElementById('deploy-contract-dialog');
            deployContractDialog.setAttribute('open', 'true');
            if (await new Promise(resolve => {
                deployContractDialog.querySelectorAll('mwc-button').forEach(b => b.addEventListener('click', (e) => {
                    resolve(e.target.getAttribute('dialogaction'));
                }))
            }) == 'deploy') {
                toggleIndeterminateProgress(true);
                localStorage.setItem('lastSavedSourceCode', sourcecodeeditor.value);
                const bytecode = await compileToByteCode(sourcecodeeditor.value, true);
                //console.log( [...bytecode].map(v => v.toString(16).padStart(2, '0')));
                await deployJScontract(bytecode);
                toggleIndeterminateProgress(false);
            }
        });
    }
}

customElements.define('code-page', CodePageComponent)