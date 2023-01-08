import { bundle } from './bundler.js';

describe('bundler', function() {
    it('should bundle with nearapi', async () => {
        const bundled = await bundle(`print('hello world')`, 'nearapi');
        expect(bundled).to.contain('function panic');
        expect(bundled).to.contain('hello world');
    });
    it('should not bundle with nearapi', async () => {
        const bundled = await bundle(`print('hello world')`);
        expect(bundled).not.to.contain('function panic');
        expect(bundled).to.contain('hello world');
    });
});