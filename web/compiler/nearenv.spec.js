import { QuickJS } from "./compilerutils.js";
import { getNearEnvSource } from "./nearenv.js";

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
    it('should be able to call an exported function with logging through env', async () => {
        const quickjs = new QuickJS();
        const source = `        
            const env = (${getNearEnvSource()})();
            export function hello() {
                env.log("Hello Near 555!");
            }
            hello();
        `;
        await quickjs.evalSource(source); 

        expect(quickjs.stdoutlines).to.include('Hello Near 555!');
    });
});