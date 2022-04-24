import { Wasi } from './wasi.mjs';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
console.log(execSync('emcc -s STANDALONE_WASM -O2 --no-entry wasmlib.c libjseval.a libquickjs.a -o jseval.wasm').toString());
(async function () {
    const getWasmInstance = async () => {
        const wasi = new Wasi({
            "LANG": "en_GB.UTF-8",
            "TERM": "xterm"
        });
        const wasm = readFileSync('./jseval.wasm');
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

    const compileToByteCode = async (src) => {
        const instance = await getWasmInstance();
        const scriptaddr = instance.malloc(src.length + 1);
        const buf = new Uint8Array(instance.memory.buffer, scriptaddr, src.length);
        for (let n = 0; n < src.length; n++) {
            buf[n] = src.charCodeAt(n);
        }
        const compiledbytecodebuflenptr = instance.malloc(4);
        const compiledbytecodeaddr = instance.compile_to_bytecode(scriptaddr, compiledbytecodebuflenptr);

        const compiledbytecodebuflen = new Uint32Array(instance.memory.buffer, compiledbytecodebuflenptr, 4)[0];
        console.log('len', compiledbytecodebuflen);

        return new Uint8Array(instance.memory.buffer, compiledbytecodeaddr, compiledbytecodebuflen);
    };

    console.log(await evalSource(`(function () {return 11+34+55+"test".length})()`));
    console.log(await evalByteCode([0x02, 0x02, 0x08, 0x74, 0x65, 0x73, 0x74, 0x1a,
        0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e, 0x65,
        0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00, 0x06,
        0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x02, 0x00,
        0x00, 0x0a, 0x01, 0xa2, 0x01, 0x00, 0x00, 0x00,
        0x04, 0xde, 0x00, 0x00, 0x00, 0xe9, 0xb9, 0x9d,
        0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00]));

    let bytecode = await compileToByteCode(`(function () {return 11+34+55+"test".length})()`);
    console.log([...bytecode].map(v => v.toString(16).padStart(2, '0')));
    console.log(await evalByteCode(bytecode));
})();
