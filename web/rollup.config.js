import { rollupPluginHTML } from '@web/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { readFileSync, rmdirSync, existsSync } from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const outdir = '../dist';
if (existsSync(outdir)) {
    rmdirSync(outdir, { recursive: true });
}

export default {
    input: './index.html',
    output: { dir: outdir, entryFileNames: "app.[hash].js" },
    plugins: [nodeResolve(), (() => ({
        transform(code, id) {
            let urlMatch;

            do {
                urlMatch = code.match(/(new URL\([^),]+\,\s*import.meta.url\s*\))/);

                if (urlMatch) {
                    const urlWithAbsolutePath = urlMatch[1].replace('import.meta.url', `'file://${id}'`);
                    const func = new Function('return ' + urlWithAbsolutePath);
                    const resolvedUrl = func();
                    const pathname = resolvedUrl.pathname;

                    if (pathname.endsWith('.html')) {
                        const datauri = `data:text/html;base64,${readFileSync(pathname).toString('base64')}`;
                        code = code.replace(urlMatch[0], `new URL('${datauri}')`);
                    } else if (pathname.endsWith('.css')) {
                        const datauri = `data:text/css;base64,${readFileSync(pathname).toString('base64')}`;
                        code = code.replace(urlMatch[0], `new URL('${datauri}')`);
                    } else if (pathname.endsWith('.js')) {
                        const datauri = `data:text/javascript;base64,${readFileSync(pathname).toString('base64')}`;
                        code = code.replace(urlMatch[0], `new URL('${datauri}')`);
                    } else {
                        console.log('skipping', urlMatch[1]);
                        urlMatch = null;
                    }
                }
            } while (urlMatch);
            return {
                code: code
            }
        }
    }))(), importMetaAssets(), rollupPluginHTML({
        include: '**/*.html', minify: true,
        transformHtml: (html) => {
            return html.replace(/<script type=\"importmap\">[^<]+<\/script>/g, "");
        }
    }), terser()],
};