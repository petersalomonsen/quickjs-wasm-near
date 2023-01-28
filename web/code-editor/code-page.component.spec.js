import { createQuickJS } from '../compiler/quickjs.js';
import { getNearConfig, createWalletConnection, callStandaloneContract, viewStandaloneContract } from '../near/near.js';

async function waitForElement(rootElement, selector) {
    return await new Promise(resolve => {
        const observer = new MutationObserver((mutationsList, observer) => {
            const foundElement = rootElement.shadowRoot.querySelector(selector);
            if (foundElement) {
                observer.disconnect();
                resolve(foundElement);
            }
        });
        observer.observe(rootElement.shadowRoot, {
            childList: true,
            subtree: true,
            attributes: true
        });
    });
}

describe('codepage-component', function () {
    this.timeout(60000);
    it('should download bytecode', async () => {
        const codePageElement = document.createElement('code-page');
        document.documentElement.appendChild(codePageElement);
        const sourcecodeeditor = await waitForElement(codePageElement, '#sourcecodeeditor');
        expect(sourcecodeeditor).not.to.be.undefined;
        await sourcecodeeditor.readyPromise;
        sourcecodeeditor.value = `print('hello')`;

        const downloadByteCodeButton = codePageElement.shadowRoot.querySelector('#downloadbytecodebutton');
        const downloadUrl = await new Promise(async resolve => {
            URL.revokeObjectURL = (url) => {
                resolve(url);
            };
            downloadByteCodeButton.click();
        });
        const bytecode = new Uint8Array(await fetch(downloadUrl).then(r => r.arrayBuffer()));
        const quickjs = await createQuickJS();
        quickjs.evalByteCode(bytecode);
        expect(quickjs.stdoutlines.indexOf('hello')).to.be.greaterThan(-1);
    });
    it('should deploy js contract to new account', async () => {
        const randomNumber = Math.floor(Math.random() * (99999999999999 - 10000000000000) + 10000000000000);

        const accountId = `dev-${Date.now()}-${randomNumber}`;

        const nearConfig = getNearConfig();
        const keyPair = await nearApi.KeyPair.fromRandom('ed25519');
        const near = await nearApi.connect(nearConfig);
        await near.accountCreator.createAccount(accountId, keyPair.publicKey);
        const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
        await keyStore.setKey(nearConfig.networkId, accountId, keyPair);
        localStorage.setItem('lastSelectedBundleType', 'minimum-web4');
        localStorage.setItem('loggedincontractname', accountId);
        localStorage.setItem('undefined_wallet_auth_key',
            JSON.stringify({ accountId: accountId, allKeys: [keyPair.publicKey] }));

        const appRootElement = document.createElement('app-root');
        document.documentElement.appendChild(appRootElement);
        const mainContainer = await waitForElement(appRootElement, '#mainContainer');
        const codePageElement = document.createElement('code-page');
        mainContainer.replaceChildren(codePageElement);

        const sourcecodeeditor = await waitForElement(codePageElement, '#sourcecodeeditor');
        await sourcecodeeditor.readyPromise;

        sourcecodeeditor.value = `export function web4_get() {
            const request = JSON.parse(env.input()).request;
        
            let response;
        
            if (request.path == '/index.html') {
                response = {
                    contentType: "text/html; charset=UTF-8",
                    body: env.base64_encode('hello')
                };
            }
            env.value_return(JSON.stringify(response));
        }
        `;

        const deployButton = codePageElement.shadowRoot.querySelector('#deploybutton');

        const deployContractDialog = codePageElement.shadowRoot.querySelector('#deploy-contract-dialog');
        deployButton.click();
        await new Promise(r => setTimeout(() => r(), 300));
        deployContractDialog.querySelector('mwc-button[dialogAction=deploy]').click();

        const successDeploySnackbar = codePageElement.shadowRoot.querySelector('#successDeploySnackbar');
        await new Promise(resolve => {
            new MutationObserver((mutationsList, observer) => resolve())
                .observe(successDeploySnackbar, { attributeFilter: ['open'] });
        });

        const response = await viewStandaloneContract(accountId, 'web4_get', { request: { path: '/index.html' } });
        console.log(response);
        expect(response).to.deep.equal({ contentType: 'text/html; charset=UTF-8', body: 'aGVsbG8=' });
        console.log('contract is deployed');
    });
});
