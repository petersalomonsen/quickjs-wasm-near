QuickJS for WebAssembly on NEAR protocol
========================================

QuickJS compiled to WebAssembly and a Web application for creating NEAR smart contracts in Javascript to run on smart contract VMs created with near-js-sdk.

[near-sdk-js](https://github.com/near/near-sdk-js>) makes it possible to deploy Javascript smart contracts on NEAR protocol.

This web application let you write, simulate, deploy and call your javascript smart contracts in the web browser.                    

Note: Currently you can only create low-level ( [see examples here](https://github.com/near/near-sdk-js/tree/master/examples/low-level) ) contracts from here.

# How to use?

Check out the deployment at https://petersalomonsen.github.io/quickjs-wasm-near/dist/index.html where you can choose between coding or calling contract in the left menu.

Choose `Code` and enter some source code in the code editor:

```
export function hello() {
    env.log("Hello Near");
}
```

Now click `save` and you'll see that the `hello` method shows up in the method dropdown under `Simulation`. Click the `run` button to see the simulation output. You can also add arguments, deposits and storage to the simulation. If your code alters storage then that will affect the storage items after running.

Finally click `deploy` to upload your code on-chain. Note that deploying needs deposit, read more about it here: https://github.com/near/near-sdk-js#usage

After deploying you can call your contract, and test with arguments and deposit.

# Building

Building this projects involves compiling QuickJS as a static library using [emscripten](https://emscripten.org) and link to a Webassembly binary with the simple wrapper library in the [wasmlib](wasmlib) folder. This provides the in-browser simulation capacity.

The web application itself is in the [web](web) folder and is a pure web component app without any framework like React or Angular. For UI components [Material Design Web Components](https://github.com/material-components/material-web) is used, and for the code editor [CodeMirror 6](https://codemirror.net/6/). To be able to use these with "bare module imports" ( e.g. `import '@material/mwc-top-app-bar';` ), an [import map](https://github.com/WICG/import-maps) is needed, which is generated using the [JSPM Import Map Generator](https://github.com/jspm/generator). Given this it's possible to host the web app directly from the source files with static hosting, no development bundler like webpack is needed. Finally also a [rollup configuration](web/rollup.config.js) is provided for single js bundle production builds, which can be found in the [dist](dist) folder and is used for the hosted version.

Also see the [github actions pipeline](.github/workflows/main.yml) for commands to build and run the tests.
