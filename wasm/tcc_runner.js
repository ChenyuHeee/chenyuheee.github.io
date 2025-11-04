/* tcc_runner.js - site-root placeholder
 * 有些脚本尝试从 '/wasm/tcc_runner.js' 加载运行器，这里提供同样的占位以防止 404/异常。
 */
(function(){
    function notReady(code, stdin){
        return Promise.reject(new Error('WASM 运行器未部署（site-root 位置）：请将真实的 tcc/clang wasm 运行器上传到 /wasm/ 并替换本文件'));
    }
    try{ window.wasmRun = notReady; }catch(e){}
})();
