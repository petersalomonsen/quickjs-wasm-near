import { createQuickJS } from "./quickjs.js";
import { createStandalone } from "./standalone.js";
import { createNearEnv } from './nearenv.js';

describe('standalone contract', function () {
    this.timeout(20000);
    it('should compile a simple JS standalone contract', async () => {
        const quickjs = await createQuickJS();
        let bytecode = quickjs.compileToByteCode(`
export function helloWorld() {
    env.log('hello world');
    env.log('hello again');
    const arr = new Uint8Array(1024*32);
    for (var n = 0; n<arr.length; n++) {
        arr[n] = 0;
    }
    env.log('arr length is' + arr.length);
}
export function helloSun() {
    env.log('hello sun');
}        

export function helloMoon() {
    env.log('hello moon');
}        

`, 'contract.js');
        const wasmBinary = await createStandalone(bytecode, ['helloWorld', 'helloSun', 'helloMoon']);

        const module = await WebAssembly.instantiate(wasmBinary, {
            env: createNearEnv()
        });
        module.instance.exports.helloWorld();
        module.instance.exports.helloSun();
        module.instance.exports.helloMoon();

        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([wasmBinary], { type: "octet/stream" }));
        a.download = 'contract.wasm';
        document.documentElement.appendChild(a);
        a.click();
        a.remove();
    });
    it('should create a standalone contract for web4', async () => {
        const js = `
const base64abc = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];

function bytesToBase64(bytes) {
    let result = '', i, l = bytes.length;
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
        result += base64abc[bytes[i] & 0x3F];
    }
    if (i === l + 1) { // 1 octet yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[(bytes[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) { // 2 octets yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[(bytes[i - 1] & 0x0F) << 2];
        result += "=";
    }
    return result;
}

function stringToBytes(str) {
    return new Uint8Array(str.length).map((v,n) => str.charCodeAt(n));
}

export function web4_get() {
    env.value_return(
    JSON.stringify({ contentType: "text/html",
                body: bytesToBase64(stringToBytes(\`Hello\`)),
        preloadUrls: [] }
    ));
}
`;
        const quickjs = await createQuickJS();
        let bytecode = quickjs.compileToByteCode(js, 'contract.js');
        const wasmBinary = await createStandalone(bytecode, ['web4_get']);

        const nearEnv = createNearEnv();
        let retLen, retPtr;
        nearEnv.value_return = (len, ptr) => { retLen = Number(len); retPtr = Number(ptr); };

        const module = await WebAssembly.instantiate(wasmBinary, {
            env: nearEnv
        });
        module.instance.exports.web4_get();
        const returnedObject = JSON.parse(new TextDecoder().decode(module.instance.exports.memory.buffer.slice(retPtr, retPtr + retLen)));
        expect(atob(returnedObject.body)).equal('Hello');
    });
});