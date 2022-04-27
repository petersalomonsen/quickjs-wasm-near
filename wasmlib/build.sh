(cd .. && make libquickjs.a)
emcc -I../ libjseval.c -c
emar rcs libjseval.a libjseval.o
emcc -g -s STANDALONE_WASM --no-entry wasmlib.c libjseval.a ../libquickjs.a -o jseval.wasm
wasm-opt -Oz jseval.wasm -o jseval.wasm
cp jseval.wasm ../web/compiler/