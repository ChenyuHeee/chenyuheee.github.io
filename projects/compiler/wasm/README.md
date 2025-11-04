# WASM 运行器占位说明

这个目录用于放置用于在浏览器中编译并运行 C 代码的 WebAssembly 运行器（例如基于 tcc 或 clang 的 Emscripten 构建）。

文件

- `tcc_runner.js` - （占位）负责引入 wasm 模块并在全局暴露 `window.wasmRun(code, stdin)`，返回一个 Promise，resolve 为 `{ stdout, stderr, exitCode }`。

部署建议

1. 使用 Emscripten 构建一个简单的 tcc/clang wrapper，导出一个 JS API，例如 `wasmRun(code, stdin)`。
2. 将构建产物（`.js` + `.wasm`）放到本目录或站点根的 `/wasm/` 目录，保证 `index.html` 中的 `tryWasmRun` 能加载到它们。

占位行为

当前占位脚本会把 `window.wasmRun` 指向一个返回 rejected Promise 的函数，表示运行器未部署，前端会回退到 Wandbox 或本地模拟。
