#include <emscripten.h>

extern int js_eval(char * source);
extern int js_eval_bytecode(const char *buf, unsigned long buf_len);
extern unsigned long js_compile_to_bytecode(char * source, unsigned long * buf_len, int module);

int EMSCRIPTEN_KEEPALIVE eval_js_source(char * source) {
    return js_eval(source);
}

unsigned long EMSCRIPTEN_KEEPALIVE compile_to_bytecode(char * source, unsigned long * buf_len, int module) {
    return js_compile_to_bytecode(source, buf_len, module);
}

int EMSCRIPTEN_KEEPALIVE eval_js_bytecode(const char *buf, unsigned long buf_len) {
    return js_eval_bytecode(buf, buf_len);
}
