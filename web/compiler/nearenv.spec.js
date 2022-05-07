import { createQuickJS } from "./quickjs.js";
import { createQuickJSWithNearEnv, getNearEnvSource } from "./nearenv.js";

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
        expect(quickjs.stdoutlines).to.include('deposit is '+deposit.toString());
    });
});