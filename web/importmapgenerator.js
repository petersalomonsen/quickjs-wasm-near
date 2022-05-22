import { Generator } from '@jspm/generator';
import { readFileSync, writeFileSync } from 'fs';

const generator = new Generator({
  mapUrl: import.meta.url,
  defaultProvider: 'jspm', // this is the default defaultProvider
  // Always ensure to define your target environment to get a working map
  // it is advisable to pass the "module" condition as supported by Webpack
  env: ['production', 'browser', 'module'],
});

const packages = ['@material/mwc-list/mwc-list-item'
  ,...Object.keys(JSON.parse(readFileSync('./package.json')).dependencies)];

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
