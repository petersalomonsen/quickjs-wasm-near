import { bundle } from './bundler.js';

describe('bundler', function() {
    it('should bundle', async () => {
        const bundled = await bundle(`print('hello world')`);
        console.log(bundled);
    });
});