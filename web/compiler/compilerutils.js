import { Wasi } from './wasi.js';

export class QuickJS {
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
            return mod.exports;
        })();
    }

    async evalSource(src, module = false) {
        const instance = await this.wasmInstancePromise;
        const scriptaddr = instance.malloc(src.length + 1);
        const buf = new Uint8Array(instance.memory.buffer,
            scriptaddr,
            src.length);
        for (let n = 0; n < src.length; n++) {
            buf[n] = src.charCodeAt(n);
        }
        return instance.eval_js_source(scriptaddr, module);
    }

    async evalByteCode(bytecode) {
        const instance = await this.wasmInstancePromise;
        const bytecodebufaddr = instance.malloc(bytecode.length);
        const bytecodebuf = new Uint8Array(instance.memory.buffer,
            bytecodebufaddr,
            bytecode.length);
        for (let n = 0; n < bytecode.length; n++) {
            bytecodebuf[n] = bytecode[n];
        }

        return instance.eval_js_bytecode(bytecodebufaddr, bytecodebuf.length);
    }

    async compileToByteCode(src, module = false) {
        const instance = await this.wasmInstancePromise;
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
    }
}
