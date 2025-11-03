// wrapper.c
// 这是一个示意性的 wrapper：展示如何把一个 C 接口导出给 Emscripten。
// 注意：真正把 tcc/clang 完整移植到 wasm 并在浏览器运行是复杂的。
// 本示例仅演示接口约定：导出 compile_and_run(code, stdin) 并返回 JSON 字符串。

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 示例实现：不进行真实编译，仅返回一个固定的 JSON（供测试用）
// 在真实实现中，你应当把代码传给嵌入的编译器（如 tcc），运行并捕获 stdout/stderr
char* compile_and_run(const char* code, const char* stdin_input) {
    // 示例输出：把输入 echo 回去（用于测试前端调用链路）
    const char* template_str = "{\"stdout\":\"模拟运行输出：%s\", \"stderr\":\"\", \"exitCode\":0}";
    size_t needed = strlen(template_str) + (code ? strlen(code) : 0) + 64;
    char* out = (char*)malloc(needed);
    if (!out) return NULL;
    snprintf(out, needed, template_str, code ? code : "");
    return out; // Emscripten 对返回的 char* 会自动处理（确保使用 malloc/strdup）
}

// 为了兼容 cwrap/ccall，导出函数名
// Emscripten 编译时，使用 -s EXPORTED_FUNCTIONS='[_compile_and_run]'
