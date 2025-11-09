---
title: Hexo建站笔记
date: 01/11/2025 19:00
---
# Hexo建站笔记
## 初始化
1. Node.js配置
官网下载
2. 安装Hexo
```
npm install -g hexo-cli
```
## 开始
```
#新建
hexo init <name>
```

## 部署
在_config.yml文件底部
```
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io.git
  branch: main
```
## 常用指令
生成
```
hexo g
```
部署
```
hexo d
```
清理**注意！在`/public`下有非生成的文件一定要注意备份，`clean`之后会全部删除**
```
hexo clean
```
测试
```
hexo s
```
