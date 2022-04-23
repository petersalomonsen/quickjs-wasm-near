const {readFileSync} = require('fs');
const {execSync} = require('child_process');
console.log(execSync('emcc -s STANDALONE_WASM -O2 --no-entry wasmlib.c libjseval.a libquickjs.a -o jseval.wasm').toString());
(async function() {
const wasm = readFileSync('./jseval.wasm');
    const instance = (await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": {
            proc_exit: () => console.log('proc exit'),
            fd_close: () => console.log('fdclose'),
            fd_write: (fd, iov) => console.log('fdwrite'),
            fd_seek: () => console.log('fdseek'),
        }
    })).instance.exports;
    const script = '33+55+"test".length';
    const scriptaddr = instance.malloc(script.length+1);
    const buf = new Uint8Array(instance.memory.buffer,
        scriptaddr,
        script.length);
    for(let n=0;n<script.length;n++) {
        buf[n] = script.charCodeAt(n);
    }
    console.log(instance.eval_js_source(scriptaddr));
})();