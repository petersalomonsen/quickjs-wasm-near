import './code-editor.component.js';
import { deployJScontract } from '../near.js';
import { createQuickJS } from '../compiler/quickjs.js'
import { toggleIndeterminateProgress } from '../common/progressindicator.js';
import { createQuickJSWithNearEnv, getNearEnvSource } from '../compiler/nearenv.js';

class CodePageComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('code-page.component.html', import.meta.url)).then(r => r.text());
        this.attachStyleSheet(new URL('code-page.component.css', import.meta.url));

        const sourcecodeeditor = this.shadowRoot.getElementById('sourcecodeeditor');
        this.sourcecodeeditor = sourcecodeeditor;
        const lastSavedSourceCode = localStorage.getItem('lastSavedSourceCode');
        sourcecodeeditor.value = lastSavedSourceCode ? lastSavedSourceCode : `export function hello() {
            env.log("Hello Near");
        }`;

        const savebutton = this.shadowRoot.getElementById('savebutton');
        savebutton.addEventListener('click', () => this.save());
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
                await this.save();
                const bytecode = (await createQuickJS()).compileToByteCode(sourcecodeeditor.value, 'contract');
                // console.log( [...bytecode].map(v => v.toString(16).padStart(2, '0')));
                await deployJScontract(bytecode);
                toggleIndeterminateProgress(false);
            }
        });

        const simulatebutton = this.shadowRoot.getElementById('simulatebutton');
        const simulationOutputArea = this.shadowRoot.querySelector('#simulationoutput');
        simulatebutton.addEventListener('click', async () => {
            const quickjs = await createQuickJSWithNearEnv(this.shadowRoot.querySelector('#argumentsinput').value);
            const bytecode = quickjs.compileToByteCode(sourcecodeeditor.value, 'contractmodule');
            quickjs.evalByteCode(bytecode);
            quickjs.stdoutlines = [];
            quickjs.stdoutlines = [];
            const selectedMethod = this.shadowRoot.querySelector('#methodselect').value;
            const runcontractsource = `import { ${selectedMethod} } from 'contractmodule';
${selectedMethod}();
`;
            quickjs.evalSource(runcontractsource, 'runcontract');
            simulationOutputArea.innerHTML = quickjs.stdoutlines.join('\n');
        });
    }

    async save() {
        const source = this.sourcecodeeditor.value;
        localStorage.setItem('lastSavedSourceCode', source);
        const methodselect = this.shadowRoot.querySelector('#methodselect');
        const quickjs = await createQuickJS();
        quickjs.evalSource(source, 'contractmodule');
        quickjs.evalSource(`import * as contract from 'contractmodule';
        print('method names:', Object.keys(contract));`, 'main');
        const methodnames = quickjs.stdoutlines.find(l => l.indexOf('method names:') == 0).substring('method names: '.length).split(',');
        methodselect.querySelectorAll('mwc-list-item').forEach(li => li.remove());
        methodnames.forEach(methodname => {            
            const option = document.createElement('mwc-list-item');
            option.innerHTML = methodname;
            option.value = methodname;
            methodselect.appendChild(option);
        });        
    }
}

customElements.define('code-page', CodePageComponent)