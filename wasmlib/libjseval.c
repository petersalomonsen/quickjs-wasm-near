#include "./quickjs.h"
#include <string.h>

JSValue global_obj;
JSValue env;
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

void create_runtime()
{
    if (rt != NULL)
    {
        return;
    }
    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicPromise(ctx);
    JS_AddIntrinsicBigInt(ctx);

    global_obj = JS_GetGlobalObject(ctx);
    JS_SetPropertyStr(ctx, global_obj, "print",
                      JS_NewCFunction(ctx, js_print, "print", 1));
}

void js_std_loop_no_os(JSContext *ctx)
{
    JSContext *ctx1;
    int err;

    /* execute the pending jobs */
    for (;;)
    {
        err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
        if (err <= 0)
        {
            if (err < 0)
            {
                printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx1)));
            }
            break;
        }
    }
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
    js_std_loop_no_os(ctx);
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

JSValue js_eval_bytecode(const uint8_t *buf, size_t buf_len)
{
    JSValue obj, val;

    create_runtime();

    obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    val = JS_EvalFunction(ctx, obj);
    if (JS_IsException(val))
    {
        printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
    }
    js_std_loop_no_os(ctx);
    return val;
}

JSValue js_load_bytecode(const uint8_t *buf, size_t buf_len)
{
    JSValue module_obj;
    JSModuleDef *m;

    create_runtime();

    module_obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    JS_EvalFunction(ctx, module_obj);
    return JS_GetModule_NS(ctx, JS_VALUE_GET_PTR(module_obj));
}

JSValue js_call_function(JSValue mod_obj, const char *function_name)
{
    JSValue fun_obj, val;

    fun_obj = JS_GetProperty(ctx, mod_obj, JS_NewAtom(ctx, function_name));
    val = JS_Call(ctx, fun_obj, mod_obj, 0, NULL);
    if (JS_IsException(val))
    {
        printf("%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
    }
    js_std_loop_no_os(ctx);
    return val;
}

void createNearEnv()
{
    global_obj = JS_GetGlobalObject(ctx);
    env = JS_NewObject(ctx);
    JS_SetPropertyStr(ctx, global_obj, "env", env);
}

void js_add_near_host_function(const char *name, JSCFunction *func, int length)
{
    JS_SetPropertyStr(ctx, env, name, JS_NewCFunction(ctx, func, name, length));
}

JSValue js_get_property(JSValue obj, const char *name)
{
    return JS_GetPropertyStr(ctx, obj, name);
}

const char *js_get_string(JSValue val)
{
    return JS_ToCString(ctx, val);
}