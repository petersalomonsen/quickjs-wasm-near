#include "./quickjs.h"
#include <string.h>

JSValue global_obj;
JSRuntime *rt = NULL;
JSContext *ctx;

static JSValue js_print(JSContext *ctx, JSValueConst this_val,
                        int argc, JSValueConst *argv)
{
    int i;
    const char *str;
    size_t len;

    for (i = 0; i < argc; i++)
    {
        if (i != 0)
            putchar(' ');
        str = JS_ToCStringLen(ctx, &len, argv[i]);
        if (!str)
            return JS_EXCEPTION;
        fwrite(str, 1, len, stdout);
        JS_FreeCString(ctx, str);
    }
    putchar('\n');
    return JS_UNDEFINED;
}

void create_runtime() {
    if (rt != NULL) {
        return;
    }
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

    global_obj = JS_GetGlobalObject(ctx);
    JS_SetPropertyStr(ctx, global_obj, "print",
                      JS_NewCFunction(ctx, js_print, "print", 1));
}

int js_eval(const char *filename, const char *source, int module)
{
    create_runtime();

    int len = strlen(source);

    JSValue val = JS_Eval(ctx,
                          source,
                          len,
                          filename,
                          (module == 1 ? JS_EVAL_TYPE_MODULE : JS_EVAL_TYPE_GLOBAL));

    if (JS_IsException(val) || JS_IsError(ctx, val))
    {
        printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
    }
    return JS_VALUE_GET_INT(val);
}

uint8_t *js_compile_to_bytecode(const char *filename, const char *source, size_t *out_buf_len, int module)
{
    create_runtime();

    int len = strlen(source);

    JSValue obj = JS_Eval(ctx,
                          source,
                          len,
                          filename,
                          JS_EVAL_FLAG_COMPILE_ONLY | (module == 1 ? JS_EVAL_TYPE_MODULE : JS_EVAL_TYPE_GLOBAL));

    if (JS_IsException(obj))
    {
        printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
    }
    return JS_WriteObject(ctx, out_buf_len, obj, JS_WRITE_OBJ_BYTECODE);
}

int js_eval_bytecode(const uint8_t *buf, size_t buf_len)
{
    create_runtime();

    JSValue obj, val;
    obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    val = JS_EvalFunction(ctx, obj);
    if (JS_IsException(val))
    {
        printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
    }
    return JS_VALUE_GET_INT(val);
}
