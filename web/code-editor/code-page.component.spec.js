import { createQuickJS } from '../compiler/quickjs.js';

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
    this.timeout(20000);
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
});