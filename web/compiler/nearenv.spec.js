import { createQuickJS } from "./quickjs.js";
import { createQuickJSWithNearEnv, getNearEnvSource } from "./nearenv.js";
import { bundle } from "./bundler.js";

describe('nearenv', () => {
    it('should simulate logging through env', async () => {
        const quickjs = await createQuickJS();
        const source = `        
            const env = (${getNearEnvSource()})();
            env.log('hello from env.log');
        `;
        quickjs.evalSource(source);
        expect(quickjs.stdoutlines).to.include('hello from env.log');
    });
    it('should be able to call an exported function from module with logging through env (compile & bytecode)', async () => {
        const quickjs = await createQuickJS();
        const source = `        
const env = (${getNearEnvSource()})();

export function hello() {
    env.log("Hello Near 555!");
}
hello();
        `;
        const bytecode = quickjs.compileToByteCode(source, true);
        quickjs.evalByteCode(bytecode);
        expect(quickjs.stdoutlines).to.include('Hello Near 555!');
    });
    it('should be able to call an exported function from module with logging through env (eval source)', async () => {
        const quickjs = await createQuickJS();
        const contractbytecode = quickjs.compileToByteCode(`export function hello() {
            env.log("Hello Near 666 abcdefghijk!");
        }`, 'contractmodule');
        quickjs.evalSource(`globalThis.env = (${getNearEnvSource()})()`, 'env');
        quickjs.evalByteCode(contractbytecode);

        quickjs.evalSource(
            `import { hello } from 'contractmodule';
hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('Hello Near 666 abcdefghijk!');
    });
    it('should receive arguments', async () => {
        const quickjs = await createQuickJSWithNearEnv('args will be here');
        const contractbytecode = quickjs.compileToByteCode(`export function hello() {
            env.jsvm_args(0)
            let input = env.read_register(0);
            env.log('input: '+input);
        }`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { hello } from 'contractmodule';
            hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('input: args will be here');
    });
    it('should return values', async () => {
        const quickjs = await createQuickJSWithNearEnv('args will be here');
        const contractbytecode = quickjs.compileToByteCode(`export function hello() {
            env.jsvm_value_return('the returned value');
        }`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { hello } from 'contractmodule';
            hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('return value: the returned value');
    });
    it('should handle attached deposit', async () => {
        const deposit = BigInt('2155166771112341412341241566111112341451');
        const quickjs = await createQuickJSWithNearEnv('some args', deposit.toString());
        const contractbytecode = quickjs.compileToByteCode(`export function hello() {
            env.log('deposit is '+env.attached_deposit().toString())
        }`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { hello } from 'contractmodule';
            hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('deposit is ' + deposit.toString());
    });
    it('should simulate storage for enclave', async () => {
        const quickjs = await createQuickJSWithNearEnv('some args', undefined, {
            'abc': 'def',
            'xxx': 'yyy'
        });
        const contractbytecode = quickjs.compileToByteCode(`
export function teststorage() {
    env.jsvm_storage_write("testkey","testvalue");
    env.jsvm_storage_read("testkey",0);
    let val = env.read_register(0);
    env.log('the value is '+val);

    env.jsvm_storage_read("abc",0);
    val = env.read_register(0);
    env.log('the value of abc is '+val);

    env.jsvm_storage_read("xxx",0);
    val = env.read_register(0);
    env.log('the value of xxx is '+val);
}
`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { teststorage } from 'contractmodule';
            teststorage();
`, 'main');
        expect(quickjs.stdoutlines).to.include('the value is testvalue');
        expect(quickjs.stdoutlines).to.include('the value of abc is def');
        expect(quickjs.stdoutlines).to.include('the value of xxx is yyy');
    });
    it('should simulate storage for standalone contract', async () => {
        const quickjs = await createQuickJSWithNearEnv('some args', undefined, {
            'abc': 'def',
            'xxx': 'yyy'
        });
        const contractbytecode = quickjs.compileToByteCode(`
export function teststorage() {
    env.storage_write("testkey","testvalue");
    env.storage_read("testkey",0);
    let val = env.read_register(0);
    env.log('the value is '+val);

    env.storage_read("abc",0);
    val = env.read_register(0);
    env.log('the value of abc is '+val);

    env.storage_read("xxx",0);
    val = env.read_register(0);
    env.log('the value of xxx is '+val);

    env.log('storage has key xxx: ' + env.storage_has_key("xxx"));
    env.log('storage has key xxxa: ' + env.storage_has_key("xxxa"));
    env.storage_remove("xxx");
    env.log('storage has key xxx after delete: ' + env.storage_has_key("xxx"));
}
`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { teststorage } from 'contractmodule';
            teststorage();
`, 'main');
        expect(quickjs.stdoutlines).to.include('the value is testvalue');
        expect(quickjs.stdoutlines).to.include('the value of abc is def');
        expect(quickjs.stdoutlines).to.include('storage has key xxx: true');
        expect(quickjs.stdoutlines).to.include('storage has key xxxa: false');
        expect(quickjs.stdoutlines).to.include('storage has key xxx after delete: false');
    });
    it('should handle args for enclave', async () => {
        const args = {
            'abc': 'def',
            'xxx': 'yyy'
        };
        const quickjs = await createQuickJSWithNearEnv(JSON.stringify(args), undefined);
        const contractbytecode = quickjs.compileToByteCode(`
export function testargs() {
    const val = env.jsvm_args(0);
    const args = JSON.parse(env.read_register(0));
    env.log(JSON.stringify(args));
}
`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { testargs } from 'contractmodule';
            testargs();
`, 'main');
        expect(quickjs.stdoutlines[0]).to.equal(JSON.stringify(args));
    });
    it('should handle args for standalone', async () => {
        const args = {
            'abc': 'def',
            'xxx': 'yyy'
        };
        const quickjs = await createQuickJSWithNearEnv(JSON.stringify(args), undefined);
        const contractbytecode = quickjs.compileToByteCode(`
export function testargs() {
    const val = env.input(0);
    const args = JSON.parse(env.read_register(0));
    env.log(JSON.stringify(args));
}
`, 'contractmodule');
        quickjs.evalByteCode(contractbytecode);
        quickjs.evalSource(
            `import { testargs } from 'contractmodule';
            testargs();
`, 'main');
        expect(quickjs.stdoutlines[0]).to.equal(JSON.stringify(args));
    });
    it('should be possible to use api.js from near-sdk-js', async () => {
        let args = {
            'abc': 'def',
            'xxx': 'yyy'
        };

        const quickjscompiler = await createQuickJS();

        let contractsource = `
        export function testargs() {
            const args = JSON.parse(input());
            log(JSON.stringify(args));
            valueReturn(signerAccountId());
        }
        export function report_state() {
            const params = JSON.parse(input());
            const ts = blockTimestamp();
            log('blocktimestamp: '+ts);
            storageWrite(params.service_name, ts);
        }
        
        export function latest_state() {
            const params = JSON.parse(input());
            valueReturn(storageRead(params.service_name));
        }
       
        `;
        contractsource = await bundle(contractsource);
        const contractByteCode = quickjscompiler.compileToByteCode(contractsource, 'contractmodule');

        let quickjs = await createQuickJSWithNearEnv(JSON.stringify(args), '5000000000000', {}, 'tester');

        quickjs.evalByteCode(contractByteCode);
        quickjs.evalSource(
            `import { testargs } from 'contractmodule';
            testargs();
        `, 'main');
        expect(quickjs.stdoutlines[0]).to.equal(JSON.stringify(args));
        expect(quickjs.stdoutlines[1]).to.equal('return value: tester');

        args = {
            'servicename': 'test'
        };

        quickjs = await createQuickJSWithNearEnv(JSON.stringify(args), undefined, {}, 'tester');
        quickjs.evalByteCode(contractByteCode);
        quickjs.evalSource(
            `import { report_state, latest_state } from 'contractmodule';
            report_state();
            latest_state();
        `, 'main');
        expect(quickjs.stdoutlines[1]).to.equal(quickjs.stdoutlines[0].replace('blocktimestamp', 'return value'));
    });
});