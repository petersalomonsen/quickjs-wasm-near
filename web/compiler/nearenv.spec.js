import { QuickJS } from "./quickjs.js";
import { createQuickJSWithNearEnv, getNearEnvSource } from "./nearenv.js";

describe('nearenv', () => {
    it('should simulate logging through env', async () => {
        const quickjs = new QuickJS();
        const source = `        
            const env = (${getNearEnvSource()})();
            env.log('hello from env.log');
        `;
        await quickjs.evalSource(source);
        expect(quickjs.stdoutlines).to.include('hello from env.log');
    });
    it('should be able to call an exported function from module with logging through env (compile & bytecode)', async () => {
        const quickjs = new QuickJS();
        const source = `        
const env = (${getNearEnvSource()})();

export function hello() {
    env.log("Hello Near 555!");
}
hello();
        `;
        const bytecode = await quickjs.compileToByteCode(source, true);
        await quickjs.evalByteCode(bytecode);
        expect(quickjs.stdoutlines).to.include('Hello Near 555!');
    });
    it('should be able to call an exported function from module with logging through env (eval source)', async () => {
        const quickjs = new QuickJS();
        const contractbytecode = await quickjs.compileToByteCode(`export function hello() {
            env.log("Hello Near 666 abcdefghijk!");
        }`, 'contractmodule');
        await quickjs.evalSource(`globalThis.env = (${getNearEnvSource()})()`, 'env');
        await quickjs.evalByteCode(contractbytecode);

        await quickjs.evalSource(
            `import { hello } from 'contractmodule';
hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('Hello Near 666 abcdefghijk!');
    });
    it('should receive arguments', async () => {
        const quickjs = await createQuickJSWithNearEnv('args will be here');
        const contractbytecode = await quickjs.compileToByteCode(`export function hello() {
            env.jsvm_args(0)
            let input = env.read_register(0);
            env.log('input: '+input);
        }`, 'contractmodule');
        await quickjs.evalByteCode(contractbytecode);
        await quickjs.evalSource(
            `import { hello } from 'contractmodule';
            hello();
`, 'main');
        expect(quickjs.stdoutlines).to.include('input: args will be here');
    });
});