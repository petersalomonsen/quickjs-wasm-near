import { Wasi } from './wasi.js';

class QuickJS {
    constructor() {
        this.wasmInstancePromise = (async () => {
            this.wasi = new Wasi({
                "LANG": "en_GB.UTF-8",
                "TERM": "xterm"
            });
            this.stdoutlines = [];
            this.stderrlines = [];
            this.wasi.stdout = (...data) => {
                this.stdoutlines.push(data.join(' '));
                console.log(...data);
            };
            this.wasi.stderr = (...data) => {
                this.stderrlines.push(data.join(' '));
                console.error(...data);
            }
            const wasm = await fetch(new URL('jseval.wasm', import.meta.url)).then(r => r.arrayBuffer());
            const mod = (await WebAssembly.instantiate(wasm, {
                "wasi_snapshot_preview1": this.wasi
            })).instance;
            this.wasi.init(mod);
            this.wasmInstance = mod.exports;
            return mod.exports;
        })();
    }

    allocateString(str) {
        const instance = this.wasmInstance;
        const straddr = instance.malloc(str.length + 1);
        const buf = new Uint8Array(instance.memory.buffer,
            straddr,
            str.length + 1);
        for (let n = 0; n < str.length; n++) {
            buf[n] = str.charCodeAt(n);
        }
        buf[str.length] = 0;
        return straddr;
    }

    evalSource(src, modulefilename='<evalsource>') {
        const instance = this.wasmInstance;
        
        return instance.eval_js_source(this.allocateString(modulefilename), this.allocateString(src), modulefilename!='<evalsource>');
    }

    evalByteCode(bytecode) {
        const instance = this.wasmInstance;
        const bytecodebufaddr = instance.malloc(bytecode.length);
        const bytecodebuf = new Uint8Array(instance.memory.buffer,
            bytecodebufaddr,
            bytecode.length);
        for (let n = 0; n < bytecode.length; n++) {
            bytecodebuf[n] = bytecode[n];
        }

        return instance.eval_js_bytecode(bytecodebufaddr, bytecodebuf.length);
    }

    compileToByteCode(src, modulefilename='<evalsource>') {
        const instance = this.wasmInstance;
        const compiledbytecodebuflenptr = instance.malloc(4);
        const compiledbytecodeaddr = instance.compile_to_bytecode(this.allocateString(modulefilename),
                this.allocateString(src), compiledbytecodebuflenptr, modulefilename!='<evalsource>');

        const compiledbytecodebuflen = new Uint32Array(instance.memory.buffer, compiledbytecodebuflenptr, 4)[0];
        console.log('len', compiledbytecodebuflen);

        return new Uint8Array(instance.memory.buffer, compiledbytecodeaddr, compiledbytecodebuflen);
    }
}

export async function createQuickJS() {
    const quickjs = new QuickJS();
    await quickjs.wasmInstancePromise;
    return quickjs;
}