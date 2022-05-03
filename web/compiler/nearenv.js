import { createQuickJS } from "./quickjs.js";

function createNearEnv(args = '') {
    const registers = {};
    return {
        "read_register": (register) => registers[register],
        "register_len": () => null,
        "write_register": () => null,
        "signer_account_id": () => null,
        "signer_account_pk": () => null,
        "predecessor_account_id": () => null,
        "block_index": () => null,
        "block_timestamp": () => null,
        "epoch_height": () => null,
        "attached_deposit": () => null,
        "prepaid_gas": () => null,
        "used_gas": () => null,
        "random_seed": () => null,
        "sha256": () => null,
        "keccak256": () => null,
        "keccak512": () => null,
        "ripemd160": () => null,
        "ecrecover": () => null,
        "panic": () => null,
        "panic_utf8": () => null,
        "log": (msg) => print(msg),
        "log_utf8": () => null,
        "log_utf16": () => null,
        "promise_create": () => null,
        "promise_then": () => null,
        "promise_and": () => null,
        "promise_batch_create": () => null,
        "promise_batch_then": () => null,
        "promise_results_count": () => null,
        "promise_result": () => null,
        "promise_return": () => null,
        "storage_read": () => null,
        "storage_has_key": () => null,
        "validator_stake": () => null,
        "validator_total_stake": () => null,

        // APIs that unique to JSVM
        "jsvm_account_id": () => null,
        "jsvm_js_contract_name": () => null,
        "jsvm_method_name": () => null,
        "jsvm_args": (register) => registers[register] = args,
        "jsvm_storage_write": () => null,
        "jsvm_storage_read": () => null,
        "jsvm_storage_has_key": () => null,
        "jsvm_storage_remove": () => null,
        "jsvm_value_return": (val) => print(`return value: ${val}`),
        "jsvm_call": () => null,
    }
};

export function getNearEnvSource() {
    return createNearEnv.toString();
}

export async function createQuickJSWithNearEnv(args) {
    const argsBase64 = btoa(args);
    const quickjs = await createQuickJS();
    await quickjs.evalSource(await fetch('https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.mjs').then(r => r.text()), 'js-base64');
    await quickjs.evalSource(`
    import { decode } from 'js-base64';
    globalThis.env = (${getNearEnvSource()})(decode('${argsBase64}'))
`, 'env');
    return quickjs;
}
