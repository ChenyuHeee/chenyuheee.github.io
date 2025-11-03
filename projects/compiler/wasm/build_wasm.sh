#!/usr/bin/env bash
# build_wasm.sh
# 用法：在拥有 emsdk 的环境中运行本脚本来构建示例 wrapper（生成 tcc.js 和 tcc.wasm）
# 注意：此脚本仅构建示例 wrapper，不包含完整的编译器实现。

set -euo pipefail

# 如果你已经安装并激活了 emsdk，请确保 emcc 在 PATH 中
if ! command -v emcc >/dev/null 2>&1; then
  echo "emcc 未找到。请先安装并激活 emsdk： https://emscripten.org/docs/getting_started/downloads.html"
  exit 1
fi

SRC=wrapper.c
OUT=tcc.js

# 简单构建：导出 _compile_and_run，并导出 cwrap/ccall
emcc "$SRC" -O2 \
  -s EXPORTED_FUNCTIONS="['_compile_and_run']" \
  -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap','ccall']" \
  -s MODULARIZE=1 -s EXPORT_NAME="TCCModule" \
  -o "$OUT"

echo "构建完成：生成 $OUT 和相关 .wasm 文件。请把它们上传到 public/projects/compiler/wasm/ 目录（与 tcc_runner.js 同层）。"

*** End Patch