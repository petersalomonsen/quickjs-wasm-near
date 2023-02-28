import { prepareWASM } from "./prepare-wasm.js";
import * as nearenv from "./wasm-near-environment.js";

export const WASM_URLS = {
    "nft": 'https://ipfs.web4.near.page/ipfs/bafkreic2ktlue3456wdmnrxf4zupu4ayvnzabgvkixihc4xc73zftoztwy?filename=nft-a61c4543.wasm',
    "minimum-web4": 'https://ipfs.web4.near.page/ipfs/bafkreigjjyocek3mdqk6rilzaxleg2swuka2nhzfx2gq4u7yicgdmvlh2a?filename=minimum_web4.wasm'
};

export async function fetchWasm(wasm_contract_type) {
    return new Uint8Array(await fetch(new URL(WASM_URLS[wasm_contract_type])).then(r => r.arrayBuffer()))
}

export async function getBuiltinJSProperties(wasm_contract_type) {
    nearenv.reset_near_env();
    const wasmbinary = prepareWASM(await fetchWasm(wasm_contract_type));

    const proxy = {};
    Object.keys(nearenv).forEach(x => {
        const orig = nearenv[x];
        proxy[x] = (...args) => {
            console.log('method and args:', x, ...args);
            const result = orig(...args);
            console.log('result:', result);
            return result;
        };
    });

    const memory = new WebAssembly.Memory({
        initial: 1024,
        maximum: 2048
    });
    nearenv.set_wasm_memory(memory);
    proxy.memory = nearenv.memory;
    const wasmmod = await WebAssembly.instantiate(wasmbinary, {
        "env": proxy
    });
    const instanceExports = wasmmod.instance.exports;

    if (instanceExports.new) {
        instanceExports.new();
    }

    nearenv.set_args({ javascript: `export function test() {env.value_return(JSON.stringify(Object.keys(env))); }` });
    instanceExports.post_javascript();
    nearenv.set_args({ function_name: 'test' });
    console.log('before call');
    instanceExports.call_js_func();
    console.log('after call');
    return JSON.parse(nearenv.latest_return_value);
}