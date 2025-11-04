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
