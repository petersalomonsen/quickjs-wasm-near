make libquickjs.a
emcc libjseval.c -c
emar rcs libjseval.a libjseval.o
node runwasm.js