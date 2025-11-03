// tcc_runner.js
// 说明：这是一个轻量的前端 wrapper，约定：
// - 你需要把一个用 Emscripten 编译的编译器模块（例如 tcc/clang 的 wasm 版本）放到 /wasm/ 目录，JS 入口名为 `tcc.js`（或你可以修改下面的路径）。
// - 该 Emscripten 模块需要导出一个 C 接口 `compile_and_run(const char* code, const char* stdin)`
//   并且通过 Module.cwrap 将其暴露为 JS 函数，返回一个 JSON 字符串：{stdout, stderr, exitCode}。
//
// 使用方式（前端调用）：
//   const result = await window.wasmRun(code, stdin);
//   // result 为 { stdout, stderr, exitCode }
//
// 如果你尚未构建 wasm 模块，这个脚本也会提示如何构建（见 ../wasm/README.md）。

(function () {
  const DEFAULT_SCRIPT = '/projects/compiler/wasm/tcc.js';

  // 内部状态
  let _loaded = false;
  let _compileAndRun = null; // JS 函数

  // 动态加载脚本
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      // 如果已经存在相同脚本，返回成功
      if (Array.from(document.scripts).some(s => s.src && s.src.endsWith(url))) {
        return resolve();
      }
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = (e) => reject(new Error('加载脚本失败: ' + url));
      document.head.appendChild(s);
    });
  }

  // 尝试从 Module 中 cwrap 出 compile_and_run
  function tryBindModule(moduleGlobalNames = ['Module', 'TCCModule']) {
    for (const name of moduleGlobalNames) {
      const mod = window[name];
      if (!mod) continue;
      // cwrap 可能存在
      try {
        if (typeof mod.cwrap === 'function') {
          // 约定：C 函数签名 -> char* compile_and_run(const char* code, const char* stdin)
          const fn = mod.cwrap('compile_and_run', 'string', ['string', 'string']);
          if (typeof fn === 'function') {
            return fn;
          }
        }
        // 有些 Emscripten 输出把函数直接放到 Module._compile_and_run 之类，也可以尝试
        if (mod._compile_and_run) {
          // 将 cfunc 包装成 JS 函数（需要 ccall）
          if (typeof mod.ccall === 'function') {
            return (code, stdin) => {
              // ccall 返回指针或字符串，尝试直接返回 JSON 字符串
              return mod.ccall('compile_and_run', 'string', ['string', 'string'], [code, stdin]);
            };
          }
        }
      } catch (e) {
        // 忽略并继续尝试其他全局名
      }
    }
    return null;
  }

  // 初始化：尝试自动加载默认的 tcc.js，然后绑定
  async function init() {
    if (_loaded) return;
    // 1) 如果 Module 已经存在，直接绑定
    _compileAndRun = tryBindModule();
    if (_compileAndRun) {
      _loaded = true;
      return;
    }

    // 2) 动态加载默认脚本并尝试绑定
    try {
      await loadScript(DEFAULT_SCRIPT);
      // 等待 Emscripten Module 准备（如果模块使用 Promise pattern，通常会设置 Module['onRuntimeInitialized'])
      // 我们尝试等待一个短时间，同时也支持 Module.onRuntimeInitialized
      const mod = window.Module || window.TCCModule;
      if (mod && typeof mod.onRuntimeInitialized === 'function') {
        await new Promise((resolve) => {
          const old = mod.onRuntimeInitialized;
          mod.onRuntimeInitialized = function () {
            try { old(); } catch (e) {}
            resolve();
          };
          // 如果旧的 onRuntimeInitialized 未触发（某些构建），我们仍会继续
          setTimeout(resolve, 1500);
        });
      } else {
        // 等待短暂时间以便脚本执行
        await new Promise(r => setTimeout(r, 800));
      }

      _compileAndRun = tryBindModule();
      if (_compileAndRun) {
        _loaded = true;
        return;
      }
      throw new Error('找不到 Emscripten 导出的函数 compile_and_run（请检查构建与导出）。');
    } catch (e) {
      throw e;
    }
  }

  // 对外暴露的 wasmRun
  window.wasmRun = async function (code, stdin) {
    // 初始化并绑定
    try {
      await init();
    } catch (e) {
      // 明确错误信息，便于用户按 README 操作
      throw new Error('WASM 运行器初始化失败：' + (e && e.message ? e.message : e));
    }

    if (!_compileAndRun) {
      throw new Error('WASM 函数未绑定：compile_and_run 不存在');
    }

    try {
      // 调用 cwrap 后的 JS 函数，要求返回 JSON 字符串
      const jsonStr = _compileAndRun(code || '', stdin || '');
      if (!jsonStr) return { stdout: '', stderr: 'WASM 返回空字符串', exitCode: 1 };
      try {
        const parsed = JSON.parse(jsonStr);
        return parsed;
      } catch (e) {
        // 如果返回不是 JSON，尝试将字符串作为 stdout
        return { stdout: String(jsonStr), stderr: '', exitCode: 0 };
      }
    } catch (e) {
      throw new Error('调用 WASM compile_and_run 失败：' + (e && e.message ? e.message : e));
    }
  };

  // 备用：当没有 wasm 时，提供一个 shim，以防前端代码直接调用
  if (!window.wasmRun) {
    window.wasmRun = async (code, stdin) => { throw new Error('wasmRun 尚未初始化'); };
  }
})();
