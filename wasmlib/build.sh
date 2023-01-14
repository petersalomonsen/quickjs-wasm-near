(cd .. && make clean && make libquickjs.a)
emcc -Oz -I../ libjseval.c -c
emar rcs libjseval.a libjseval.o
emcc -s STANDALONE_WASM --no-entry wasmlib.c libjseval.a ../libquickjs.a -Oz -o jseval.wasm
wasm-opt -Oz jseval.wasm -o jseval.wasm
cp jseval.wasm ../web/compiler/