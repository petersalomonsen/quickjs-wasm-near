#!/bin/bash

wget https://bellard.org/quickjs/quickjs-2024-01-13.tar.xz
tar -xf quickjs-2024-01-13.tar.xz
rm quickjs-2024-01-13.tar.xz

git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
cd ..
npm i -g wasm-opt
(cd wasmlib && source ../emsdk/emsdk_env.sh && ./build.sh)                    
cd ../web
yarn install
