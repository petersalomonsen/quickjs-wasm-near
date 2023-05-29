import { Generator } from '@jspm/generator';
import { readFileSync, writeFileSync } from 'fs';

const generator = new Generator({
  mapUrl: import.meta.url,
  defaultProvider: 'jspm', // this is the default defaultProvider
  // Always ensure to define your target environment to get a working map
  // it is advisable to pass the "module" condition as supported by Webpack
  env: ['module'],
  //commonJS: true,
  inputMap: {
    "imports": {
      "@codemirror/autocomplete": "https://ga.jspm.io/npm:@codemirror/autocomplete@6.4.2/dist/index.js",
      "@codemirror/commands": "https://ga.jspm.io/npm:@codemirror/commands@6.2.1/dist/index.js",
      "@codemirror/lang-javascript": "https://ga.jspm.io/npm:@codemirror/lang-javascript@6.1.4/dist/index.js",
      "@codemirror/language": "https://ga.jspm.io/npm:@codemirror/language@6.6.0/dist/index.js",
      "@codemirror/state": "https://ga.jspm.io/npm:@codemirror/state@6.2.0/dist/index.js",
      "@codemirror/view": "https://ga.jspm.io/npm:@codemirror/view@6.9.1/dist/index.js",
      "@material/mwc-button": "https://ga.jspm.io/npm:@material/mwc-button@0.27.0/mwc-button.js",
      "@material/mwc-dialog": "https://ga.jspm.io/npm:@material/mwc-dialog@0.27.0/mwc-dialog.js",
      "@material/mwc-drawer": "https://ga.jspm.io/npm:@material/mwc-drawer@0.27.0/mwc-drawer.js",
      "@material/mwc-fab": "https://ga.jspm.io/npm:@material/mwc-fab@0.27.0/mwc-fab.js",
      "@material/mwc-icon-button": "https://ga.jspm.io/npm:@material/mwc-icon-button@0.27.0/mwc-icon-button.js",
      "@material/mwc-linear-progress": "https://ga.jspm.io/npm:@material/mwc-linear-progress@0.27.0/mwc-linear-progress.js",
      "@material/mwc-list": "https://ga.jspm.io/npm:@material/mwc-list@0.27.0/mwc-list.js",
      "@material/mwc-list/mwc-list-item": "https://ga.jspm.io/npm:@material/mwc-list@0.27.0/mwc-list-item.js",
      "@material/mwc-select": "https://ga.jspm.io/npm:@material/mwc-select@0.27.0/mwc-select.js",
      "@material/mwc-snackbar": "https://ga.jspm.io/npm:@material/mwc-snackbar@0.27.0/mwc-snackbar.js",
      "@material/mwc-textfield": "https://ga.jspm.io/npm:@material/mwc-textfield@0.27.0/mwc-textfield.js",
      "@material/mwc-top-app-bar": "https://ga.jspm.io/npm:@material/mwc-top-app-bar@0.27.0/mwc-top-app-bar.js",
      "codemirror": "https://ga.jspm.io/npm:codemirror@6.0.1/dist/index.js"
    },
    "scopes": {
      "https://ga.jspm.io/": {
        "@codemirror/lint": "https://ga.jspm.io/npm:@codemirror/lint@6.1.1/dist/index.js",
        "@codemirror/search": "https://ga.jspm.io/npm:@codemirror/search@6.2.3/dist/index.js",
        "@lezer/common": "https://ga.jspm.io/npm:@lezer/common@1.0.2/dist/index.js",
        "@lezer/highlight": "https://ga.jspm.io/npm:@lezer/highlight@1.1.3/dist/index.js",
        "@lezer/javascript": "https://ga.jspm.io/npm:@lezer/javascript@1.4.1/dist/index.es.js",
        "@lezer/lr": "https://ga.jspm.io/npm:@lezer/lr@1.3.3/dist/index.js",
        "@lit/reactive-element": "https://ga.jspm.io/npm:@lit/reactive-element@1.6.1/reactive-element.js",
        "@lit/reactive-element/decorators/": "https://ga.jspm.io/npm:@lit/reactive-element@1.6.1/decorators/",
        "@material/animation/animationframe": "https://ga.jspm.io/npm:@material/animation@14.0.0-canary.53b3cad2f.0/animationframe.js",
        "@material/base/foundation": "https://ga.jspm.io/npm:@material/base@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/base/foundation.js": "https://ga.jspm.io/npm:@material/base@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/dialog/": "https://ga.jspm.io/npm:@material/dialog@14.0.0-canary.53b3cad2f.0/",
        "@material/dom/keyboard": "https://ga.jspm.io/npm:@material/dom@14.0.0-canary.53b3cad2f.0/keyboard.js",
        "@material/dom/": "https://ga.jspm.io/npm:@material/dom@14.0.0-canary.53b3cad2f.0/",
        "@material/drawer/": "https://ga.jspm.io/npm:@material/drawer@14.0.0-canary.53b3cad2f.0/",
        "@material/floating-label/foundation.js": "https://ga.jspm.io/npm:@material/floating-label@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/line-ripple/foundation.js": "https://ga.jspm.io/npm:@material/line-ripple@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/list/constants": "https://ga.jspm.io/npm:@material/list@14.0.0-canary.53b3cad2f.0/constants.js",
        "@material/list/": "https://ga.jspm.io/npm:@material/list@14.0.0-canary.53b3cad2f.0/",
        "@material/menu-surface/constants": "https://ga.jspm.io/npm:@material/menu-surface@14.0.0-canary.53b3cad2f.0/constants.js",
        "@material/menu-surface/foundation": "https://ga.jspm.io/npm:@material/menu-surface@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/menu-surface/": "https://ga.jspm.io/npm:@material/menu-surface@14.0.0-canary.53b3cad2f.0/",
        "@material/menu/": "https://ga.jspm.io/npm:@material/menu@14.0.0-canary.53b3cad2f.0/",
        "@material/mwc-base/": "https://ga.jspm.io/npm:@material/mwc-base@0.27.0/",
        "@material/mwc-floating-label/mwc-floating-label-directive.js": "https://ga.jspm.io/npm:@material/mwc-floating-label@0.27.0/mwc-floating-label-directive.js",
        "@material/mwc-icon/mwc-icon.js": "https://ga.jspm.io/npm:@material/mwc-icon@0.27.0/mwc-icon.js",
        "@material/mwc-line-ripple/mwc-line-ripple-directive.js": "https://ga.jspm.io/npm:@material/mwc-line-ripple@0.27.0/mwc-line-ripple-directive.js",
        "@material/mwc-list/": "https://ga.jspm.io/npm:@material/mwc-list@0.27.0/",
        "@material/mwc-menu/mwc-menu.js": "https://ga.jspm.io/npm:@material/mwc-menu@0.27.0/mwc-menu.js",
        "@material/mwc-notched-outline/mwc-notched-outline.js": "https://ga.jspm.io/npm:@material/mwc-notched-outline@0.27.0/mwc-notched-outline.js",
        "@material/mwc-ripple/": "https://ga.jspm.io/npm:@material/mwc-ripple@0.27.0/",
        "@material/notched-outline/foundation.js": "https://ga.jspm.io/npm:@material/notched-outline@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/ripple/foundation.js": "https://ga.jspm.io/npm:@material/ripple@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/select/foundation.js": "https://ga.jspm.io/npm:@material/select@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/snackbar/foundation.js": "https://ga.jspm.io/npm:@material/snackbar@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/textfield/foundation.js": "https://ga.jspm.io/npm:@material/textfield@14.0.0-canary.53b3cad2f.0/foundation.js",
        "@material/top-app-bar/": "https://ga.jspm.io/npm:@material/top-app-bar@14.0.0-canary.53b3cad2f.0/",
        "blocking-elements": "https://ga.jspm.io/npm:blocking-elements@0.1.1/dist/blocking-elements.js",
        "crelt": "https://ga.jspm.io/npm:crelt@1.0.5/index.es.js",
        "lit": "https://ga.jspm.io/npm:lit@2.6.1/index.js",
        "lit-element/lit-element.js": "https://ga.jspm.io/npm:lit-element@3.2.2/lit-element.js",
        "lit-html": "https://ga.jspm.io/npm:lit-html@2.6.1/lit-html.js",
        "lit-html/": "https://ga.jspm.io/npm:lit-html@2.6.1/",
        "lit/": "https://ga.jspm.io/npm:lit@2.6.1/",
        "style-mod": "https://ga.jspm.io/npm:style-mod@4.0.0/src/style-mod.js",
        "tslib": "https://ga.jspm.io/npm:tslib@2.5.0/tslib.es6.js",
        "w3c-keyname": "https://ga.jspm.io/npm:w3c-keyname@2.2.6/index.es.js",
        "wicg-inert": "https://ga.jspm.io/npm:wicg-inert@3.1.2/dist/inert.esm.js"
      }
  }},
  ignore: [
    '@material/menu-surface/constants',
    '@material/menu-surface/foundation'
  ]
});

const packages = [
  ...Object.keys(JSON.parse(readFileSync('./package.json')).dependencies)
];

// Install a new package into the import map
for (const p of packages) {
  await generator.install(p);
}

const importMapJson = JSON.stringify(generator.getMap(), null, 2);
let indexHtml = readFileSync('index.html').toString();
indexHtml = indexHtml.replace(/\<script type=\"importmap\"\>[^<]+\<\/script\>/,
  `<script type="importmap">${importMapJson}</script>`)
writeFileSync('index.html', indexHtml);
