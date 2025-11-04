/*
 * tcc_runner.js - WASM loader for the placeholder wrapper module
 * Behavior:
 *  - 如果存在由 emcc 生成的 module（例如 dist/tcc_runner.js），则通过 createTccModule() 加载并梳理 API
 *  - 否则退回到友好的错误信息（保持 window.wasmRun 可用且返回 rejected Promise）
 *
 * 预期：构建后会在同目录生成 dist/tcc_runner.js + dist/tcc_runner.wasm（由 build_wasm.sh 输出）
 */
(function(){
    // 默认：若未能加载真实模块，则返回 rejected Promise，前端会继续使用 Wandbox 或模拟回退
    function notReady(code, stdin){
        return Promise.reject(new Error('WASM 运行器尚未部署（请运行 build_wasm.sh 并将构建产物放到 /projects/compiler/wasm/dist/）'));
    }
    })();
                const s = document.createElement('script'); s.src = entry;
                s.onload = () => resolve(); s.onerror = () => reject(new Error('加载失败: '+entry));
                document.head.appendChild(s);
            });

            if (typeof window.createTccModule !== 'function') {
                console.warn('构建脚本已加载但未检测到 createTccModule() 导出');
                return;
            }

            // 创建 Module 实例
            const moduleInstance = await window.createTccModule();

            // 使用 cwrap 将 C API 包装为 JS 函数
            const run_code = moduleInstance.cwrap('run_code', 'number', ['string']);
            const free_buffer = moduleInstance.cwrap('free_buffer', null, ['number']);

            // 暴露 window.wasmRun 接口：接受 code, stdin，返回 Promise
            window.wasmRun = function(code, stdin){
                return new Promise((resolve, reject) => {
                    try{
                        const ptr = run_code(code || '');
                        if (!ptr) return resolve({ stdout: '', stderr: 'no output', exitCode: 0 });
                        const out = moduleInstance.UTF8ToString(ptr);
                        // 释放 C 端内存
                        free_buffer(ptr);
                        resolve({ stdout: out, stderr: '', exitCode: 0 });
                    }catch(e){
                        reject(e);
                    }
                });
            };

            console.info('WASM runner 已加载并已设置 window.wasmRun');
        }catch(e){
            console.warn('未能加载本地 WASM 运行器：', e.message || e);
        }
    }

    // 触发加载（延迟执行，不阻塞页面）
    try{ window.addEventListener('load', () => { setTimeout(tryLoadDist, 600); }); }catch(e){ tryLoadDist(); }

})();
/* tcc_runner.js - placeholder
 * 如果你没有构建 wasm 运行器，这个占位脚本可以避免页面在尝试加载 /projects/compiler/wasm/tcc_runner.js 时抛错。
 * 它会暴露一个简易的 window.wasmRun 接口，调用时返回一个被拒绝的 Promise，提示缺少真实运行器。
 */
(function(){
    function notReady(code, stdin){
        return Promise.reject(new Error('WASM 运行器未部署：请将真实的 tcc/clang wasm 运行器上传到 /projects/compiler/wasm/ 并替换本文件'));
    }
    try{ window.wasmRun = notReady; }catch(e){}
})();
