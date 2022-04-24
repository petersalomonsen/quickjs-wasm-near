#include "./quickjs.h"
#include <string.h>

int js_eval(const char * source) {
    JSRuntime* rt; JSContext* ctx;

    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicBigInt(ctx);

    int len = strlen(source);

    JSValue val = JS_Eval(ctx,
                          source,
                          len,
                          "<evalScript>",
                          JS_EVAL_TYPE_GLOBAL);

    if (JS_IsException(val) || JS_IsError(ctx, val)) {
        printf("exception:%s\n",JS_ToCString(ctx, val));
    } else {
        printf("success %d\n",JS_VALUE_GET_INT(val));
    }
    return JS_VALUE_GET_INT(val);
}

uint8_t * js_compile_to_bytecode(const char * source, size_t * out_buf_len) {
    JSRuntime* rt; JSContext* ctx;

    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicBigInt(ctx);

    int len = strlen(source);
    
    JSValue obj = JS_Eval(ctx,
                          source,
                          len,
                          "hello",
                          JS_EVAL_FLAG_COMPILE_ONLY);

    if (JS_IsException(obj)) {
        printf("exception:%s\n",JS_ToCString(ctx, obj));
    }
    return JS_WriteObject(ctx, out_buf_len, obj, JS_WRITE_OBJ_BYTECODE);    
}

int js_eval_bytecode(const uint8_t *buf, size_t buf_len) {
    JSRuntime* rt; JSContext* ctx;

    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicBigInt(ctx);

    JSValue obj, val;
    obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    val = JS_EvalFunction(ctx, obj);
    if (JS_IsException(val)) {
        printf("exception:%s\n",JS_ToCString(ctx, val));
    } else {
        printf("success %d\n",JS_VALUE_GET_INT(val));
    }
    return JS_VALUE_GET_INT(val);
}