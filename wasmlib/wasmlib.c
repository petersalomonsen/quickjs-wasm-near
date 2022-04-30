#include <emscripten.h>

extern int js_eval(char * filename, char *source, int module);
extern int js_eval_bytecode(const char *buf, unsigned long buf_len);
extern unsigned long js_compile_to_bytecode(char * filename, char *source, unsigned long *buf_len, int module);

int EMSCRIPTEN_KEEPALIVE eval_js_source(char *filename, char *source, int module)
{
    return js_eval(filename, source, module);
}

unsigned long EMSCRIPTEN_KEEPALIVE compile_to_bytecode(char *filename, char *source, unsigned long *buf_len, int module)
{
    return js_compile_to_bytecode(filename, source, buf_len, module);
}

int EMSCRIPTEN_KEEPALIVE eval_js_bytecode(const char *buf, unsigned long buf_len)
{
    return js_eval_bytecode(buf, buf_len);
}
