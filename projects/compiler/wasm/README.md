WASM 运行器说明（放在 `public/projects/compiler/wasm/`）

目标
----
为 GitHub Pages 提供一个可选的浏览器端编译器（WASM）。前端已集成 `wasm/tcc_runner.js`，它约定并调用全局的 Emscripten 模块函数 `compile_and_run(const char* code, const char* stdin)`，并期望该函数返回一个 JSON 字符串：

  { "stdout": "...", "stderr": "...", "exitCode": 0 }

如果你希望在没有后端的情况下实现真实的 C 编译并运行，下面有两个路径：使用现成的 prebuilt wasm（若存在），或自行构建 Emscripten 模块。

选项 A：查找并使用 prebuilt 的 tcc/clang wasm
--------------------------------------------
1. 在网上搜索 `tcc wasm`, `tinycc wasm`, `clang wasm` 的预编译包（有时社区会发布到 GitHub Releases 或 CDN）。
2. 将对应的 `tcc.js`（或类似由 Emscripten 生成的 JS loader）与 `tcc.wasm` 放到本目录（`/projects/compiler/wasm/`）。
3. 确保 JS 文件将 Module 全局对象暴露为 `Module` 或 `TCCModule` 并且导出可通过 `Module.cwrap('compile_and_run', 'string', ['string','string'])` 调用的函数。
4. 提交到 GitHub，浏览器会从 `https://<your-user>.github.io/projects/compiler/wasm/tcc.js` 加载该脚本，前端会调用 `window.wasmRun(code, stdin)`。

选项 B（推荐可控）：使用 Emscripten 自行构建一个轻量 wrapper
-------------------------------------------------
下面给出一个极简示例，展示如何用 Emscripten 将一个 C/C++ wrapper 编译成 `tcc.js`/`tcc.wasm`，并导出 `compile_and_run`。

1) 准备一个 wrapper 的 C 文件（例如 wrapper.c），它调用你打包到 wasm 的编译器（例如 tinycc/tcc），并在执行后返回 JSON 字符串。示例（伪代码，仅说明思路）：

```c
// wrapper.c (示意)
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 这是示意函数；实际实现需要集成 tcc 的 API
char* compile_and_run(const char* code, const char* stdin) {
    // 1. 调用 tcc API 把 code 编译成可执行内存
    // 2. 在受控环境中运行可执行内存，把 stdout/stderr 捕获
    // 3. 返回一个 malloc'ed JSON 字符串，如：
    //    {"stdout":"...","stderr":"...","exitCode":0}
    // 注意：Emscripten 返回 string 时需要用 strdup 或 malloc
    const char* out = "{\"stdout\":\"Hello\", \"stderr\":\"\", \"exitCode\":0}";
    char* r = strdup(out);
    return r;
}
```

注意：真正把 tcc/clang 嵌入到 wasm 并可在浏览器中执行涉及大量工程工作（文件系统、动态链接、运行时隔离等），上面的示意只是接口规范。

2) 使用 Emscripten 编译：

```bash
# 假设你已安装 emsdk 并激活 emcc
emcc wrapper.c -s EXPORTED_FUNCTIONS="['_compile_and_run']" -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap','ccall']" -o tcc.js
# 这会生成 tcc.js + tcc.wasm（若 wrapper 中引用了其他库，还需链接）
```

3) 在你的 `tcc.js` 中，确保在 Module 上可以通过 `Module.cwrap('compile_and_run', 'string', ['string','string'])` 调用。

4) 把 `tcc.js` 和 `tcc.wasm` 上传到 `public/projects/compiler/wasm/` 并提交到 GitHub。前端会自动加载并调用。

安全与性能注意
----------------
- 在浏览器中编译并执行程序会消耗用户设备资源；复杂程序可能导致页面卡顿或浏览器崩溃。
- 不同浏览器/设备能力不一；一些系统调用或标准库特性在 wasm 中不可用或受限。
- 若要支持更复杂的运行（网络、文件系统等），建议考虑后端或容器化方案。

常见问题排查
-------------
- "加载失败 / wasmRun 未定义": 请确认 `tcc.js` 已成功部署到 `/projects/compiler/wasm/tcc.js`，并且文件路径在 `tcc_runner.js` 中的 DEFAULT_SCRIPT 配置正确。
- "找不到 compile_and_run": 确认你在构建时导出了 `compile_and_run`，并在 JS Module 上可通过 `cwrap` 调用。
- Wandbox 或其他公共 API 可作为优先尝试（前端已集成）；若这些公共 API 被浏览器阻止（CORS），WASM 可以作为离线回退。

更多资源
--------
- Emscripten 官方文档: https://emscripten.org/docs/
- TinyCC 项目: https://bellard.org/tcc/
- Wandbox API 说明: https://wandbox.org/api

如果你希望，我可以：
- 生成一个更详细的 `wrapper.c` 示例（包含如何捕获 stdout/stderr 的思路），
- 或者尝试寻找一个可直接使用的 prebuilt tcc/clang wasm 的发布链接并把其放到仓库（需你确认许可后我再下载/引用）。

GitHub Actions 自动构建（已添加）
---------------------------------

已为本仓库添加一个示例 workflow，用于在 push 到 `main` 时自动构建 WASM 并把静态文件部署到 GitHub Pages（或你仓库的 Pages 发布分支）。

- workflow 文件: `.github/workflows/build_and_deploy_wasm.yml`
- 触发条件: push 到 `main`（当 `public/projects/compiler/wasm/**` 或 workflows 改动时），以及手动触发（workflow_dispatch）。
- 流程概要:
  1. Checkout 仓库
  2. 在 `ubuntu-latest` 上使用 `emscripten/emsdk-action` 安装 emsdk
  3. 运行 `public/projects/compiler/wasm/build_wasm.sh` 生成 `tcc.js`/`tcc.wasm`
  4. 使用 `peaceiris/actions-gh-pages` 将 `public` 目录发布到 GitHub Pages

注意事项与调优建议:

- 构建延迟: Emscripten 编译通常需要几十秒到几分钟（取决于源码规模与优化等级）。这是一次性或按你 push 触发的动作；网页用户不会在每次访问时等待 Actions。
- 缓存建议: 若你频繁修改或需要缩短 CI 时间，可以在 workflow 中增加 `actions/cache` 对 emsdk、ccache 或中间产物进行缓存。
- 自定义分支/路径: 如果你的主分支不是 `main` 或想在 release/tag 时构建，请修改 workflow 的 `on:` 配置。

本地快速测试构建（在你已安装 emsdk 的机器上）:

```bash
# (只在你尚未安装 emsdk 时需要)：
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

# 在仓库根目录运行构建脚本：
chmod +x public/projects/compiler/wasm/build_wasm.sh
./public/projects/compiler/wasm/build_wasm.sh
```

我可以继续为你做：

- 把 workflow 调整为只发布 `public/projects/compiler/wasm` 子目录（而非整个 `public`），
- 或把 workflow 优化加入 `actions/cache`，并演示如何缩短后续 run 时间。

