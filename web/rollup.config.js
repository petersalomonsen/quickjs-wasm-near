import html from '@web/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { readFileSync, writeFileSync, unlinkSync, rmdirSync } from 'fs';

const outdir = '../dist';
rmdirSync(outdir, {recursive: true});

export default {
    input: './index.html',
    output: { dir: outdir },
    plugins: [(() => ({
        transform(code, id) {
            const urlMatch = code.match(/(new URL\([^),]+\,\s*import.meta.url\s*\))/);
            if (urlMatch) {
                const urlWithAbsolutePath = urlMatch[1].replace('import.meta.url', `'file://${id}'`);
                const func = new Function('return ' + urlWithAbsolutePath);
                const resolvedUrl = func();
                const pathname = resolvedUrl.pathname;
                if (pathname.endsWith('.html')) {
                    const datauri = `data:text/html;base64,${readFileSync(pathname).toString('base64')}`;
                    code = code.replace(urlMatch[0], `new URL('${datauri}')`);
                } else if (pathname.endsWith('.wasm')) {
                    const datauri = `data:application/wasm;base64,${readFileSync(pathname).toString('base64')}`;
                    code = code.replace(urlMatch[0], `new URL('${datauri}')`);
                } else if (pathname.endsWith('.js')) {
                    code = code.replace(urlMatch[0], `URL.createObjectURL(new Blob([
                        (() => {
                            function jsFunc() {${readFileSync(pathname).toString()}}
                            const jsFuncSource = jsFunc.toString();
                            return jsFuncSource.substring( jsFuncSource.indexOf('{') + 1,  jsFuncSource.lastIndexOf('}'));
                        })()
                    ],
                        { type: 'text/javascript' }))`);
                }
            }
            return {
                code: code
            }
        }
    }))(), importMetaAssets(), html({ include: '**/*.html', minify: true }), terser()],
};