import { QuickJS } from './quickjs.js';

describe('compiler', () => {
    it('should compile and evaluate js source', async () => {
        const quickjs = new QuickJS();
        expect(await quickjs.evalSource(`(function () {return 11+34+55+"test".length})()`)).to.equal(11 + 34 + 55 + "test".length);
    });
    it('should evaluate quickjs bytecode', async () => {
        const quickjs = new QuickJS();
        console.log('eval bytecode', await quickjs.evalByteCode([0x02, 0x02, 0x08, 0x74, 0x65, 0x73, 0x74, 0x1a,
            0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e, 0x65,
            0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00, 0x06,
            0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x02, 0x00,
            0x00, 0x0a, 0x01, 0xa2, 0x01, 0x00, 0x00, 0x00,
            0x04, 0xde, 0x00, 0x00, 0x00, 0xe9, 0xb9, 0x9d,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00]));
    });
    it('should compile and evaluate quickjs bytecode', async () => {
        const quickjs = new QuickJS();
        let bytecode = await quickjs.compileToByteCode(`(function () {return 11+34+44+"test".length})()`);
        expect(await quickjs.evalByteCode(bytecode)).to.equal(11 + 34 + 44 + "test".length);
    });
    it('should handle JSON.parse', async () => {
        const quickjs = new QuickJS();
        expect(await quickjs.evalSource(`JSON.parse('1')`)).to.equal(1);
        expect(await quickjs.evalByteCode([0x02, 0x02, 0x0a, 0x70, 0x61, 0x72, 0x73, 0x65,
            0x1a, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e,
            0x65, 0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00,
            0x06, 0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x03,
            0x00, 0x01, 0x11, 0x01, 0xa2, 0x01, 0x00, 0x00,
            0x00, 0x38, 0x9b, 0x00, 0x00, 0x00, 0x42, 0xde,
            0x00, 0x00, 0x00, 0xbf, 0x00, 0x24, 0x01, 0x00,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00, 0x07, 0x02,
            0x31])).to.equal(1);
    });
    it('should handle JSON.parse in bytecode', async () => {
        const quickjs = new QuickJS();
        expect(await quickjs.evalByteCode(await quickjs.compileToByteCode(`JSON.parse('{"a": 222}').a+3`))).to.equal(JSON.parse('{"a": 222}').a + 3);
    });
    it('should be able to import modules', async () => {
        const quickjs = new QuickJS();
        await quickjs.evalSource(`
        export function hello() {
            return 'hello from module';
        }
        `, 'module1.js');
        await quickjs.evalSource(`
        import { hello } from 'module1.js';

        print(hello());        

        `, 'main.js');
        expect(quickjs.stdoutlines).to.include('hello from module');
    });
    it('should be able to import module from bytecode', async () => {
        const quickjs1 = new QuickJS();
        const bytecode = await quickjs1.compileToByteCode(`
        export function hello() {
            return 'hello from module';
        }
        `, 'module2.js');

        const quickjs2 = new QuickJS();
        await quickjs2.evalByteCode(bytecode);
        await quickjs2.evalSource(`
        import { hello } from 'module2.js';

        print(hello());        

        `, 'main.js');
        expect(quickjs2.stdoutlines).to.include('hello from module');
    });
});
