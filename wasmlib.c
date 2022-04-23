#include <emscripten.h>

extern int js_eval(char * source);
extern int js_eval_bytecode(const char *buf, unsigned long buf_len);

int EMSCRIPTEN_KEEPALIVE eval_js_source(char * source) {
    return js_eval(source);
}

int EMSCRIPTEN_KEEPALIVE eval_js_bytecode(const char *buf, unsigned long buf_len) {
    return js_eval_bytecode(buf, buf_len);
}
