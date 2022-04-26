import { Generator } from '@jspm/generator';
import { readFileSync, writeFileSync } from 'fs';

const generator = new Generator({
  mapUrl: import.meta.url,
  defaultProvider: 'jspm', // this is the default defaultProvider
  // Always ensure to define your target environment to get a working map
  // it is advisable to pass the "module" condition as supported by Webpack
  env: ['production', 'browser', 'module'],
});

// Install a new package into the import map
await generator.install('@material/mwc-top-app-bar');
await generator.install('@material/mwc-icon-button');
await generator.install('@material/mwc-button');
await generator.install('@material/mwc-textfield');
await generator.install('@codemirror/basic-setup');    
await generator.install('@codemirror/state');
await generator.install('@codemirror/lang-javascript');

let indexHtml = readFileSync('index.html').toString();
indexHtml = indexHtml.replace(/\<script type=\"importmap\"\>[^<]+\<\/script\>/,
            `<script type="importmap">${JSON.stringify(generator.getMap(), null, 2)}</script>`)
writeFileSync('index.html', indexHtml);