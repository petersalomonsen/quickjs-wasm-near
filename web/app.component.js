import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import '@material/mwc-textfield';

import './code-editor/code-editor.component.js';
import { deployJScontract, callJSContract, walletConnection } from './near.js';
import { Wasi } from './wasi.js';

import { setAppComponent, toggleIndeterminateProgress } from './common/progressindicator.js';

HTMLElement.prototype.attachStyleSheet = function (url) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = url;
    this.shadowRoot.appendChild(linkElement);
};

const getWasmInstance = async () => {
    const wasi = new Wasi({
        "LANG": "en_GB.UTF-8",
        "TERM": "xterm"
    });
    const wasm = await fetch(new URL('jseval.wasm', import.meta.url)).then(r => r.arrayBuffer());
    const mod = (await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": wasi
    })).instance;
    wasi.init(mod);
    return mod.exports;
}

const evalSource = async (src) => {
    const instance = await getWasmInstance();
    const scriptaddr = instance.malloc(src.length + 1);
    const buf = new Uint8Array(instance.memory.buffer,
        scriptaddr,
        src.length);
    for (let n = 0; n < src.length; n++) {
        buf[n] = src.charCodeAt(n);
    }
    return instance.eval_js_source(scriptaddr);
}

const evalByteCode = async (bytecode) => {
    const instance = await getWasmInstance();
    const bytecodebufaddr = instance.malloc(bytecode.length);
    const bytecodebuf = new Uint8Array(instance.memory.buffer,
        bytecodebufaddr,
        bytecode.length);
    for (let n = 0; n < bytecode.length; n++) {
        bytecodebuf[n] = bytecode[n];
    }

    return instance.eval_js_bytecode(bytecodebufaddr, bytecodebuf.length);
}

const compileToByteCode = async (src, module = false) => {
    const instance = await getWasmInstance();
    const scriptaddr = instance.malloc(src.length + 1);
    const buf = new Uint8Array(instance.memory.buffer, scriptaddr, src.length);
    for (let n = 0; n < src.length; n++) {
        buf[n] = src.charCodeAt(n);
    }
    const compiledbytecodebuflenptr = instance.malloc(4);
    const compiledbytecodeaddr = instance.compile_to_bytecode(scriptaddr, compiledbytecodebuflenptr, module);

    const compiledbytecodebuflen = new Uint32Array(instance.memory.buffer, compiledbytecodebuflenptr, 4)[0];
    console.log('len', compiledbytecodebuflen);

    return new Uint8Array(instance.memory.buffer, compiledbytecodeaddr, compiledbytecodebuflen);
};

class AppComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('app.component.html', import.meta.url)).then(r => r.text());
        this.attachStyleSheet(new URL('app.component.css', import.meta.url));
        setAppComponent(this);
        toggleIndeterminateProgress(true);

        console.log('eval js', await evalSource(`(function () {return 11+34+55+"test".length})()`));
        console.log('eval bytecode', await evalByteCode([0x02, 0x02, 0x08, 0x74, 0x65, 0x73, 0x74, 0x1a,
            0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e, 0x65,
            0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00, 0x06,
            0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x02, 0x00,
            0x00, 0x0a, 0x01, 0xa2, 0x01, 0x00, 0x00, 0x00,
            0x04, 0xde, 0x00, 0x00, 0x00, 0xe9, 0xb9, 0x9d,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00]));

        let bytecode = await compileToByteCode(`(function () {return 11+34+55+"test".length})()`);
        console.log('eval compiled bytecode', await evalByteCode(bytecode));

        console.log('JSON parse', await evalSource(`JSON.parse('1')`));
        console.log('JSON parse in bytecode', await evalByteCode([0x02, 0x02, 0x0a, 0x70, 0x61, 0x72, 0x73, 0x65,
            0x1a, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e,
            0x65, 0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00,
            0x06, 0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x03,
            0x00, 0x01, 0x11, 0x01, 0xa2, 0x01, 0x00, 0x00,
            0x00, 0x38, 0x9b, 0x00, 0x00, 0x00, 0x42, 0xde,
            0x00, 0x00, 0x00, 0xbf, 0x00, 0x24, 0x01, 0x00,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00, 0x07, 0x02,
            0x31]));

        console.log('JSON parse compile and eval', await evalByteCode(await compileToByteCode(`JSON.parse('{"a": 222}').a+3`)));


    const deploybutton = this.shadowRoot.getElementById('deploybutton');
    const sourcecodeeditor = this.shadowRoot.getElementById('sourcecodeeditor');
    const lastSavedSourceCode = localStorage.getItem('lastSavedSourceCode');
    sourcecodeeditor.value = lastSavedSourceCode ? lastSavedSourceCode : `export function hello() {
        env.log("Hello Near");
    }`;

    deploybutton.addEventListener('click', async () => {
        toggleIndeterminateProgress(true);
        localStorage.setItem('lastSavedSourceCode', sourcecodeeditor.value);
        const bytecode = await compileToByteCode(sourcecodeeditor.value, true);
        //console.log( [...bytecode].map(v => v.toString(16).padStart(2, '0')));
        await deployJScontract(bytecode);
        toggleIndeterminateProgress(false);
    });

    const callcontractbutton = this.shadowRoot.getElementById('callcontractbutton');
    const contractnameinput = this.shadowRoot.getElementById('contractnameinput');

    const methodnameinput = this.shadowRoot.getElementById('methodnameinput');
    const argsinput = this.shadowRoot.getElementById('argsinput');
    callcontractbutton.addEventListener('click', async () => {
        toggleIndeterminateProgress(true);
        const contractOutputArea = this.shadowRoot.querySelector('#contractoutput');
        const result = await callJSContract(contractnameinput.value, methodnameinput.value, argsinput.value);
        contractOutputArea.innerHTML = result.receipts_outcome.map(r => r.outcome.logs.join('\n')).join('\n');
        toggleIndeterminateProgress(false);
    });

    (async () => {
        contractnameinput.value = (await walletConnection).account().accountId;
    })();
    toggleIndeterminateProgress(false);
    }
}

customElements.define('app-root', AppComponent);