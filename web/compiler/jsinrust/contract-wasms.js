import { prepareWASM } from "./prepare-wasm.js";
import * as nearenv from "./wasm-near-environment.js";

let current_wasm_binary;
let current_wasm_contract_type;

const proxy = {};
Object.keys(nearenv).forEach(x => {
    const orig = nearenv[x];
    proxy[x] = (...args) => {
        //    console.log('method and args:', x, ...args);
        const result = orig(...args);
        //    console.log('result:', result);
        return result;
    };
});

export const WASM_URLS = {
    "nft": 'https://ipfs.web4.near.page/ipfs/bafkreic2ktlue3456wdmnrxf4zupu4ayvnzabgvkixihc4xc73zftoztwy?filename=nft-a61c4543.wasm',
    "minimum-web4": 'https://ipfs.web4.near.page/ipfs/bafkreigjjyocek3mdqk6rilzaxleg2swuka2nhzfx2gq4u7yicgdmvlh2a?filename=minimum_web4.wasm'
};

export async function fetchWasm(wasm_contract_type) {
    return new Uint8Array(await fetch(new URL(WASM_URLS[wasm_contract_type])).then(r => r.arrayBuffer()))
}

export async function loadContractWasmIntoSimulator(wasm_contract_type) {
    if (wasm_contract_type != current_wasm_contract_type) {
        current_wasm_contract_type = wasm_contract_type;
        console.log('loading contract binary', wasm_contract_type);
        nearenv.reset_near_env();
        current_wasm_binary = new Promise(async resolve => resolve(prepareWASM(await fetchWasm(wasm_contract_type))));

        const instance = await getContractSimulationInstance();
        if (instance.new) {
            console.log('Initializing contract');
            instance.new();
        }
    }
}

export async function getContractSimulationInstance() {
    nearenv.reset_near_env(false);
    const memory = new WebAssembly.Memory({
        initial: 1024,
        maximum: 2048
    });
    nearenv.set_wasm_memory(memory);
    proxy.memory = nearenv.memory;
    const wasmmod = await WebAssembly.instantiate(await current_wasm_binary, {
        "env": proxy
    });
    const instanceExports = wasmmod.instance.exports;
    return instanceExports;
}

export async function getJSEnvProperties() {
    const instanceExports = await getContractSimulationInstance();

    nearenv.set_args({ javascript: `export function test() {env.value_return(JSON.stringify(Object.keys(env))); }` });
    instanceExports.post_javascript();
    nearenv.set_args({ function_name: 'test' });
    instanceExports.call_js_func();
    return JSON.parse(nearenv.latest_return_value);
}