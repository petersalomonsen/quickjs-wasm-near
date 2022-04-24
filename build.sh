make libquickjs.a
emcc libjseval.c -c
emar rcs libjseval.a libjseval.o
emcc -g -s STANDALONE_WASM --no-entry wasmlib.c libjseval.a libquickjs.a -o jseval.wasm
