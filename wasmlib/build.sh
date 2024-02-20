QUICKJS_ROOT=../quickjs-2024-01-13
export CC=emcc
(cd $QUICKJS_ROOT && make CC=emcc AR=emar libquickjs.a)
emcc -Oz -I$QUICKJS_ROOT libjseval.c -c
emar rcs libjseval.a libjseval.o
emcc -s STANDALONE_WASM -s EXPORTED_FUNCTIONS="['_malloc']" --no-entry wasmlib.c libjseval.a $QUICKJS_ROOT/libquickjs.a -Oz -o jseval.wasm
wasm-opt -Oz jseval.wasm -o jseval.wasm
cp jseval.wasm ../web/compiler/