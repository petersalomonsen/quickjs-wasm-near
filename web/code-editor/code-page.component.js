import './code-editor.component.js';
import { deployJScontract, getSuggestedDepositForContract } from '../near/near.js';
import { createQuickJS } from '../compiler/quickjs.js'
import { toggleIndeterminateProgress } from '../common/progressindicator.js';
import { createQuickJSWithNearEnv } from '../compiler/nearenv.js';

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
                const deployContract = async (deposit = undefined) => {
                    try {
                        console.log('deploy contract with deposit', deposit);
                        await deployJScontract(bytecode, deposit);
                        toggleIndeterminateProgress(false);
                        this.shadowRoot.querySelector('#successDeploySnackbar').show();
                    } catch(e) {
                        console.error(e);
                        if (e.message.indexOf('insufficient deposit for storage')>=0) {
                            await deployContract(getSuggestedDepositForContract(bytecode.length));
                        } else {
                            const errorDeployContractDialog = this.shadowRoot.getElementById('error-deploying-contract-dialog');                            
                            errorDeployContractDialog.querySelector('#errormessage').textContent = e.message;
                            errorDeployContractDialog.setAttribute('open', 'true');
                            toggleIndeterminateProgress(false);
                        }
                    }
                };
                await deployContract();
            }
        });

        const addstorageitembutton = this.shadowRoot.getElementById('addstorageitembutton');
        const storageitemsdiv = this.shadowRoot.getElementById('storageitems');
        const addStorageItem = (key = '', val = '') => {
            const storageitemtemplate = this.shadowRoot.getElementById('storageitemtemplate');
            storageitemsdiv.appendChild(storageitemtemplate.content.cloneNode(true));
            const storageitem = storageitemsdiv.lastElementChild;
            storageitem.querySelector('.deletestorageitembutton').addEventListener('click', () => storageitem.remove());
            storageitem.querySelector('.storagekeyinput').value = key;
            storageitem.querySelector('.storagevalueinput').value = val;
        };
        addstorageitembutton.addEventListener('click', () => {
            addStorageItem();
        });

        const getStorageObj = () => [ ...storageitemsdiv.children ].reduce((p, c) => {
            p[c.querySelector('.storagekeyinput').value] = c.querySelector('.storagevalueinput').value;
            return p;
        }, {}); 

        const simulatebutton = this.shadowRoot.getElementById('simulatebutton');
        this.simulationOutputArea = this.shadowRoot.querySelector('#simulationoutput');
        simulatebutton.addEventListener('click', async () => {
            const deposit = this.shadowRoot.querySelector('#depositinput').value;
            const quickjs = await createQuickJSWithNearEnv(
                    this.shadowRoot.querySelector('#argumentsinput').value,
                    deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined,
                    getStorageObj(),
                    this.shadowRoot.querySelector('#signeraccountidinput').value
                );
            const bytecode = quickjs.compileToByteCode(sourcecodeeditor.value, 'contractmodule');
            quickjs.evalByteCode(bytecode);
            quickjs.stdoutlines = [];
            quickjs.stdoutlines = [];
            const selectedMethod = this.shadowRoot.querySelector('#methodselect').value;
            if (selectedMethod) {
                const runcontractsource = `import { ${selectedMethod} } from 'contractmodule';
    ${selectedMethod}();
    `;
                quickjs.evalSource(runcontractsource, 'runcontract');
                this.simulationOutputArea.textContent = quickjs.stdoutlines.join('\n');
                quickjs.stdoutlines = [];
                quickjs.evalSource('env.print_storage()', 'printstorage');
                const storageAfterRun = JSON.parse(quickjs.stdoutlines[0]);
                storageitemsdiv.replaceChildren([]);
                for (const key in storageAfterRun) {
                    addStorageItem(key, storageAfterRun[key]);
                }
            } else {
                this.shadowRoot.querySelector('#selectMethodSnackbar').show();
            }
        });
    }

    async save() {
        const source = this.sourcecodeeditor.value;
        localStorage.setItem('lastSavedSourceCode', source);
        const methodselect = this.shadowRoot.querySelector('#methodselect');
        const quickjs = await createQuickJS();
        try {
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
            this.simulationOutputArea.innerHTML = '';
        } catch (e) {
            this.simulationOutputArea.innerHTML = quickjs.stdoutlines.join('\n');
            const compileErrorSnackbar = this.shadowRoot.querySelector('#compileErrorSnackbar');
            compileErrorSnackbar.show();
        }
    }
}

customElements.define('code-page', CodePageComponent)