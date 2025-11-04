# WASM 运行器占位说明

这个目录用于放置用于在浏览器中编译并运行 C 代码的 WebAssembly 运行器（例如基于 tcc 或 clang 的 Emscripten 构建）。

文件

- `tcc_runner.js` - （占位）负责引入 wasm 模块并在全局暴露 `window.wasmRun(code, stdin)`，返回一个 Promise，resolve 为 `{ stdout, stderr, exitCode }`。

部署建议

1. 使用 Emscripten 构建一个简单的 tcc/clang wrapper，导出一个 JS API，例如 `wasmRun(code, stdin)`。
2. 将构建产物（`.js` + `.wasm`）放到本目录或站点根的 `/wasm/` 目录，保证 `index.html` 中的 `tryWasmRun` 能加载到它们。

占位行为

当前占位脚本会把 `window.wasmRun` 指向一个返回 rejected Promise 的函数，表示运行器未部署，前端会回退到 Wandbox 或本地模拟。

---

构建示例

本仓库同时提供一个最小示例，可以在有 Emscripten 的机器上构建：

1. 安装并激活 Emscripten（emsdk）。
2. 进入 `public/projects/compiler/wasm/` 并运行 `./build_wasm.sh`。
3. 构建结果会输出到 `public/projects/compiler/wasm/dist/`，包括 `tcc_runner.js` 和 `tcc_runner.wasm`。

说明：当前示例 `wrapper.c` 仅是占位的 C API（返回接收到的源码前几百字），用于演示如何在浏览器端通过 `Module.cwrap` 调用 C 函数。要实现真正的编译器，需要把 tcc/clang 的源码或移植版本编译为 wasm，并提供标准输入/输出捕获接口。

安全与性能提示

- 将大型编译器编译为 wasm 通常会生成 >10MB 的 wasm 二进制，上传到 GitHub Pages 时注意仓库大小与下载性能。
- 建议对编译器的构建产物使用 gzip/brotli 压缩和合理的缓存策略。

