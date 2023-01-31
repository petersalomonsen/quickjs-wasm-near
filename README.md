QuickJS for WebAssembly and Javascript contracts inside Rust on NEAR protocol
=============================================================================

QuickJS compiled to WebAssembly and a Web application for creating and deploying NEAR smart contracts in Javascript embedded into Rust smart contracts.

The Rust smart contracts you can extend using Javascript are:

- [Web4 minimum contract]() ( implement `web4_get` to serve web content directly from the smart contract )
- [NFT](https://github.com/petersalomonsen/quickjs-rust-near/tree/master/examples/nft)

A live example of the NFT with all the content served from and stored with the smart contract can be found at https://webassemblymusic.near.page - so in effect the NFTs you implement here can be more than links to external content, but also include the content itself and a full website to be stored and live forever on the blockchain.

This Rust smart contracts for this project can be found in https://github.com/petersalomonsen/quickjs-rust-near

# Building

Building this projects involves compiling QuickJS as a static library using [emscripten](https://emscripten.org) and link to a Webassembly binary with the simple wrapper library in the [wasmlib](wasmlib) folder. This provides the in-browser simulation capacity.

The web application itself is in the [web](web) folder and is a pure web component app without any framework like React or Angular. For UI components [Material Design Web Components](https://github.com/material-components/material-web) is used, and for the code editor [CodeMirror 6](https://codemirror.net/6/). To be able to use these with "bare module imports" ( e.g. `import '@material/mwc-top-app-bar';` ), an [import map](https://github.com/WICG/import-maps) is needed, which is generated using the [JSPM Import Map Generator](https://github.com/jspm/generator). Given this it's possible to host the web app directly from the source files with static hosting, no development bundler like webpack is needed. Finally also a [rollup configuration](web/rollup.config.js) is provided for single js bundle production builds, which can be found in the [dist](dist) folder and is used for the hosted version.

Also see the [github actions pipeline](.github/workflows/main.yml) for commands to build and run the tests.
