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
  '@material/mwc-top-app-bar@0.25.3',
  '@material/mwc-icon-button@0.25.3',
  '@material/mwc-dialog@0.25.3',
  '@material/mwc-drawer@0.25.3',
  '@material/mwc-list@0.25.3',
  '@material/mwc-list@0.25.3/mwc-list-item',
  '@material/mwc-button@0.25.3',
  '@material/mwc-textfield@0.25.3',
  '@material/mwc-linear-progress@0.25.3',
  '@material/mwc-select@0.25.3',
  '@material/mwc-snackbar@0.25.3',
  '@codemirror/basic-setup',
  '@codemirror/state',
  '@codemirror/lang-javascript'
];
// Install a new package into the import map
for(const p of packages) {
  await generator.install(p);
}

const importMapJson = JSON.stringify(generator.getMap(), null, 2);
let indexHtml = readFileSync('index.html').toString();
indexHtml = indexHtml.replace(/\<script type=\"importmap\"\>[^<]+\<\/script\>/,
            `<script type="importmap">${importMapJson}</script>`)
writeFileSync('index.html', indexHtml);
writeFileSync('importmap.js', `
const importmapscriptelement = document.createElement('script');
importmapscriptelement.type = 'importmap';
importmapscriptelement.textContent = JSON.stringify(${importMapJson});
document.currentScript.after(importmapscriptelement);
`);
