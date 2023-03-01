import './code-editor.component.js';
import { initNFTContract, deployJScontract, deployStandaloneContract, getSuggestedDepositForContract, isStandaloneMode } from '../near/near.js';
import { createQuickJS } from '../compiler/quickjs.js'
import { toggleIndeterminateProgress } from '../common/progressindicator.js';
import { createQuickJSWithNearEnv } from '../compiler/nearenv.js';
import { createStandalone } from '../compiler/standalone.js';
import { bundle } from '../compiler/bundler.js';
import html from './code-page.component.html.js';
import css from './code-page.component.css.js';
import { WASM_URLS } from '../compiler/jsinrust/contract-wasms.js';
import { setCompletions } from './code-editor.component.js';

class CodePageComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.readyPromise = this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;

        const sourcecodeeditor = this.shadowRoot.getElementById('sourcecodeeditor');
        await sourcecodeeditor.readyPromise;
        this.sourcecodeeditor = sourcecodeeditor;
        const lastSavedSourceCode = localStorage.getItem('lastSavedSourceCode');
        const lastSelectedBundleType = localStorage.getItem('lastSelectedBundleType');

        sourcecodeeditor.value = lastSavedSourceCode ? lastSavedSourceCode : `export function hello() {
            env.log("Hello Near");
        }`;

        const savebutton = this.shadowRoot.getElementById('savebutton');
        savebutton.addEventListener('click', () => this.save());

        const compileByteCode = async () => (await createQuickJS()).compileToByteCode(await bundle(sourcecodeeditor.value, this.bundletypeselect.value), 'contract');
        const deploybutton = this.shadowRoot.getElementById('deploybutton');
        this.bundletypeselect = this.shadowRoot.getElementById('bundletypeselect');
        await new Promise(r => setTimeout(() => r(), 100));
        this.bundletypeselect.value = lastSelectedBundleType;

        if (this.bundletypeselect.value != '') {
            setCompletions(this.bundletypeselect.value);
        }
        this.bundletypeselect.addEventListener('change', () => setCompletions(this.bundletypeselect.value));
        deploybutton.addEventListener('click', async () => {
            if (this.bundletypeselect.value == '') {
                this.shadowRoot.querySelector('#selectTargetContractTypeSnackbar').show();
                return;
            }

            const deployContractDialog = this.shadowRoot.getElementById('deploy-contract-dialog');
            deployContractDialog.show();
            if (await new Promise(resolve => {
                deployContractDialog.querySelectorAll('mwc-button').forEach(b => b.addEventListener('click', (e) => {
                    resolve(e.target.getAttribute('dialogaction'));
                }))
            }) == 'deploy') {
                toggleIndeterminateProgress(true);
                await this.save();
                const bytecode = await compileByteCode();
                let deployMethodName = 'deploy_js_contract';
                const deployContract = async (deposit = undefined) => {
                    let retryDeploying = true;
                    while (retryDeploying) {
                        try {
                            console.log('deploy contract with deposit', deposit);
                            await deployJScontract(bytecode, deposit, deployMethodName);
                            this.shadowRoot.querySelector('#successDeploySnackbar').show();
                            retryDeploying = false;
                        } catch (e) {
                            console.error(e);
                            if (e.message.indexOf('insufficient deposit for storage') >= 0) {
                                await deployContract(getSuggestedDepositForContract(bytecode.length));
                                toggleIndeterminateProgress(false);
                            } else if (
                                e.message.indexOf('Contract method is not found') >= 0 ||
                                e.message.indexOf('Cannot find contract code for account') >= 0
                            ) {
                                console.log(`Deploying ${this.bundletypeselect.value} contract wasm because of ${e.message}`);
                                let wasmUrl = WASM_URLS[this.bundletypeselect.value];

                                await deployStandaloneContract(
                                    new Uint8Array(await fetch(new URL(wasmUrl))
                                        .then(r => r.arrayBuffer()))
                                );
                            } else if (e.message.indexOf('The contract is not initialized') >= 0) {
                                await initNFTContract();
                            } else {
                                const errorDeployContractDialog = this.shadowRoot.getElementById('error-deploying-contract-dialog');
                                errorDeployContractDialog.querySelector('#errormessage').textContent = e.message;
                                errorDeployContractDialog.show();
                                retryDeploying = false;
                            }
                        }
                    }
                    toggleIndeterminateProgress(false);
                };

                if (this.bundletypeselect.value == 'nearapi') {
                    if (await isStandaloneMode()) {
                        const standaloneWasmBytes = await createStandalone(bytecode, this.exportedMethodNames);
                        await deployStandaloneContract(standaloneWasmBytes);
                        toggleIndeterminateProgress(false);
                    } else {
                        await deployContract();
                    }
                } else {
                    deployMethodName = 'post_quickjs_bytecode';
                    await deployContract();
                }
            }
        });
        const downloadbytecodebutton = this.shadowRoot.getElementById('downloadbytecodebutton');
        downloadbytecodebutton.addEventListener('click', async () => {
            const bytecode = await compileByteCode();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([bytecode], { type: 'application/octet-stream' }));
            link.download = 'quickjsbytecode.bin';
            document.documentElement.appendChild(link);
            link.click();
            document.documentElement.removeChild(link);
            URL.revokeObjectURL(link.href);
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

        const getStorageObj = () => [...storageitemsdiv.children].reduce((p, c) => {
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
            const bytecode = quickjs.compileToByteCode(await bundle(sourcecodeeditor.value, this.bundletypeselect.value), 'contractmodule');
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
                this.simulationContext = {
                    selectedMethod: selectedMethod,
                    storage: storageAfterRun,
                    arguments: this.shadowRoot.querySelector('#argumentsinput').value,
                    deposit: this.shadowRoot.querySelector('#depositinput').value,
                };
                localStorage.setItem('lastSimulationContext', JSON.stringify(this.simulationContext));
            } else {
                this.shadowRoot.querySelector('#selectMethodSnackbar').show();
            }
        });

        const lastSimulationContextJSON = localStorage.getItem('lastSimulationContext');
        if (lastSimulationContextJSON) {
            this.simulationContext = JSON.parse(lastSimulationContextJSON);
            this.shadowRoot.querySelector('#methodselect').value = this.simulationContext.selectedMethod;
            this.shadowRoot.querySelector('#argumentsinput').value = this.simulationContext.arguments;
            this.shadowRoot.querySelector('#depositinput').value = this.simulationContext.deposit;
            const storageitemsdiv = this.shadowRoot.getElementById('storageitems');
            storageitemsdiv.replaceChildren([]);
            for (const key in this.simulationContext.storage) {
                addStorageItem(key, this.simulationContext.storage[key]);
            }
        }
    }

    async save() {
        const source = this.sourcecodeeditor.value;
        localStorage.setItem('lastSavedSourceCode', source);
        localStorage.setItem('lastSelectedBundleType', this.bundletypeselect.value);
        const methodselect = this.shadowRoot.querySelector('#methodselect');
        const quickjs = await createQuickJS();
        try {
            quickjs.evalSource(await bundle(source, this.bundletypeselect.value), 'contractmodule');
            quickjs.evalSource(`import * as contract from 'contractmodule';
            print('method names:', Object.keys(contract));`, 'main');
            const methodnames = quickjs.stdoutlines.find(l => l.indexOf('method names:') == 0).substring('method names: '.length).split(',');
            this.exportedMethodNames = methodnames;
            methodselect.querySelectorAll('mwc-list-item').forEach(li => li.remove());
            methodnames.forEach(methodname => {
                const option = document.createElement('mwc-list-item');
                option.innerHTML = methodname;
                option.value = methodname;
                methodselect.appendChild(option);
            });
            this.simulationOutputArea.innerHTML = '';
            if (this.simulationContext) {
                setTimeout(() => methodselect.value = this.simulationContext.selectedMethod, 0);
            }
        } catch (e) {
            this.simulationOutputArea.innerHTML = quickjs.stdoutlines.join('\n');
            const compileErrorSnackbar = this.shadowRoot.querySelector('#compileErrorSnackbar');
            compileErrorSnackbar.show();
        }
    }
}

customElements.define('code-page', CodePageComponent)