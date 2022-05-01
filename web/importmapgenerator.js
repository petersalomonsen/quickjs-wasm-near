import { Generator } from '@jspm/generator';
import { readFileSync, writeFileSync } from 'fs';

const generator = new Generator({
  mapUrl: import.meta.url,
  defaultProvider: 'jspm', // this is the default defaultProvider
  // Always ensure to define your target environment to get a working map
  // it is advisable to pass the "module" condition as supported by Webpack
  env: ['production', 'browser', 'module'],
});

const packages = [
  '@material/mwc-top-app-bar',
  '@material/mwc-icon-button',
  '@material/mwc-dialog',
  '@material/mwc-drawer',
  '@material/mwc-list',
  '@material/mwc-list/mwc-list-item',
  '@material/mwc-button',
  '@material/mwc-textfield',
  '@material/mwc-linear-progress',
  '@material/mwc-select',
  '@codemirror/basic-setup',
  '@codemirror/state',
  '@codemirror/lang-javascript'
];
// Install a new package into the import map
for(const p of packages) {
  await generator.install(p);
}

let indexHtml = readFileSync('index.html').toString();
indexHtml = indexHtml.replace(/\<script type=\"importmap\"\>[^<]+\<\/script\>/,
            `<script type="importmap">${JSON.stringify(generator.getMap(), null, 2)}</script>`)
writeFileSync('index.html', indexHtml);