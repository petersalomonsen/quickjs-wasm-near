import { deployJScontract, callJSContract, walletConnection } from './near.js';
import { Wasi } from './wasi.js';

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
(async function () {

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
})();

const deploybutton = document.getElementById('deploybutton');
const sourcecodeeditor = document.getElementById('sourcecode');
const lastSavedSourceCode = localStorage.getItem('lastSavedSourceCode');
sourcecodeeditor.value = lastSavedSourceCode ? lastSavedSourceCode : `export function hello() {
    env.log("Hello Near");
}`;

deploybutton.addEventListener('click', async () => {
    localStorage.setItem('lastSavedSourceCode', lastSavedSourceCode);
    const bytecode = await compileToByteCode(sourcecodeeditor.value, true);
    //console.log( [...bytecode].map(v => v.toString(16).padStart(2, '0')));
    deployJScontract(bytecode);
});

const callcontractbutton = document.getElementById('callcontractbutton');
const contractnameinput = document.getElementById('contractnameinput');

const methodnameinput = document.getElementById('methodnameinput');
const argsinput = document.getElementById('argsinput');
callcontractbutton.addEventListener('click', async () => {
    console.log(await callJSContract(contractnameinput.value, methodnameinput.value, argsinput.value));
});

(async () => {
    contractnameinput.value = (await walletConnection).account().accountId;
})();