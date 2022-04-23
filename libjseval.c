#include "./quickjs.h"
#include <string.h>

int js_eval(const char * source) {
    JSRuntime* rt; JSContext* ctx;

    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);

    JS_AddIntrinsicEval(ctx);
    int len = strlen(source);
    
    JSValue ret = JS_Eval(ctx,
                          source,
                          len,
                          "<evalScript>",
                          JS_EVAL_TYPE_GLOBAL);
    return JS_VALUE_GET_INT(ret);
}

int js_eval_bytecode(const uint8_t *buf, size_t buf_len) {
    JSRuntime* rt; JSContext* ctx;

    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);
    JS_AddIntrinsicEval(ctx);

    JSValue obj, val;
    obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    JS_ResolveModule(ctx, obj);                
    val = JS_EvalFunction(ctx, obj);
    
    return JS_VALUE_GET_INT(val);
}