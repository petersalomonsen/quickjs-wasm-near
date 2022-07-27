import WabtModule from './wabt/libwabt.js';

export async function createStandalone(bytecode, functionNames) {
    const wabt = await WabtModule();
    let wat = await fetch(new URL('standalone.wat', import.meta.url)).then(r => r.text());

    const jsStorageBase = 353408;
    const contractDataString = `(data (;244;) (i32.const ${jsStorageBase}) "${Array.from(bytecode).map(c => '\\'+c.toString(16).padStart(2, '0')).join('')}")\n`;
    wat += contractDataString;
    wat = wat.replace('CONTRACT_BYTES_END', `${jsStorageBase+bytecode.length}`)
    const jsFunctionNamesBase = jsStorageBase + bytecode.length;

    const jsFunctionExports = [];
    const jsFunctionWats = [];
    const jsFunctionNames = [];

    let jsFunctionNdx = 0;
    const jsFunction = (name) => {
        const nameaddr = jsFunctionNamesBase + jsFunctionNames.length + jsFunctionNames.reduce((p,c) => p + c.length, 0);
        jsFunctionNames.push(name);        
        jsFunctionExports.push(`(export "${name}" (func ${1265+jsFunctionNdx}))\n`);
        jsFunctionWats.push(`
    (func (;${1265+jsFunctionNdx};) (type 50)
    (local i32 i32 i32 i32 i32 i64 i64)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    call 135
    call 136
    local.tee 0
    call 137
    local.get 0
    local.get 0
    local.get 0
    call 138
    local.tee 5
    local.get 0
    i32.const ${nameaddr}
    call 139
    local.get 5
    i32.const 0
    call 140
    local.get 5
    i32.const 0
    i32.const 0
    call 141
    i64.const -4294967296
    i64.and
    i64.const 25769803776
    i64.eq
    if  ;; label = @1
      local.get 0
      i32.load offset=16
      local.tee 2
      i64.load offset=128
      local.set 5
      local.get 2
      i64.const 8589934592
      i64.store offset=128
      local.get 0
      local.get 5
      i32.const 30180
      call 142
      local.set 6
      local.get 0
      local.get 5
      i32.const 87668
      call 142
      local.set 5
      local.get 0
      local.get 1
      i32.const 12
      i32.add
      local.get 6
      call 143
      local.set 2
      local.get 0
      local.get 1
      i32.const 8
      i32.add
      local.get 5
      call 143
      local.set 4
      local.get 1
      i32.load offset=12
      local.tee 3
      local.get 1
      i32.load offset=8
      i32.add
      i32.const 1
      i32.add
      call 57
      local.get 2
      local.get 3
      call 93
      local.tee 2
      local.get 1
      i32.load offset=12
      i32.add
      local.tee 3
      i32.const 10
      i32.store8
      local.get 3
      i32.const 1
      i32.add
      local.get 4
      local.get 1
      i32.load offset=8
      call 93
      drop
      local.get 1
      i32.load offset=12
      local.get 1
      i32.load offset=8
      i32.add
      i32.const 1
      i32.add
      i64.extend_i32_u
      local.get 2
      i64.extend_i32_u
      call 0
    end
    local.get 0
    call 144
    local.get 1
    i32.const 16
    i32.add
    global.set 0)
`);
        jsFunctionNdx++;
    };

    functionNames.forEach(functionName => jsFunction(functionName));

    wat = wat.replace('JS_FUNCTIONS', jsFunctionWats.join('\n'));
    wat = wat.replace('JS_FUNCTION_EXPORTS', jsFunctionExports.join('\n'));

    const jsFunctionNamesDataString = `(data (;245;) (i32.const ${jsFunctionNamesBase}) "${jsFunctionNames.join('\\00')}\\00"))`;
    wat += jsFunctionNamesDataString;

    const wasm = wabt.parseWat('standalone.wat', wat);
    const bin = wasm.toBinary({});
    return bin.buffer;
}