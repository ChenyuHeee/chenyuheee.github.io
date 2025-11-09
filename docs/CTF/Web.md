---
title: Web
date: 02/11/2025 18:00
---
# Web
## Web前置技能
### HTTP协议
**做题手段：Burp Suite**
- 请求方式
- 302跳转
- Cookie
- 基础认证
- 响应包源代码
## 信息泄露
### 目录便历
**做题手段：dirsearch**
配置：git clone
```
cd dirsearch
python3 dirsearch.py -u url
```
### PHPINFO
直接看php代码
### 备份文件下载
目录便历里直接找
### Git泄露
**做题手段：GitHack**
配置：git clone
```
cd GitHack
python2 GitHack.py <url>/.git
```
### SVN泄露
#### SVN泄露介绍
SVN（Subversion）是一种集中式版本控制系统，广泛用于软件开发中管理文件版本变更，通过创建 .svn 隐藏目录存储版本库元数据（如文件快照、提交历史、配置信息等），方便开发者追踪代码修改、回溯历史版本。

而 SVN 泄露 则是因网站部署时未删除 .svn 目录，导致该目录被公开访问所引发的信息泄露问题。攻击者可利用 dvcs-ripper 等工具，通过访问目标网站的 .svn 路径（如 http://example.com/.svn），提取其中的版本库数据，还原源代码、历史提交记录甚至旧版本中的敏感信息等。
#### DVCS-Ripper工具
1. 工具简介
    DVCS-Ripper（通常也叫 rip-*.pl）是一款专门用于检测和利用配置错误的安全工具。它的核心功能是：当发现一个网站意外地暴露了其版本控制系统的元数据目录（如 .git, .svn, .hg）时，它能够远程下载并重建整个代码仓库，从而造成源代码泄露。
    ```
    项目地址： https://github.com/kost/dvcs-ripper 
    ```
2. 下载安装
    ```
    sudo git clone https://github.com/kost/dvcs-ripper
    ```
    - 基本使用方法
    DVCS-Ripper 的运行依赖于一些 Perl 模块，需要安装响应的依赖库，具体如下所示。
    ```
    #安装依赖文件
    sudo apt-get install perl libio-socket-ssl-perl libdbd-sqlite3-perl libclass-dbi-perl libio-all-lwp-perl
    ```
    进入到dvcs-ripper目录中，验证安装是否成功，具体方法如下所示。
    ```
    # 进入你克隆的目录
    cd dvcs-ripper
 
    # 运行工具需要指定 perl 解释器和脚本路径
    perl rip-git.pl --help
 
    # 或者给脚本添加执行权限后直接运行
    chmod +x rip-git.pl
    ./rip-git.pl --help

    ```
3. 利用步骤
dvcs-ripper工具对svn源码泄露的利用过程如下所示，先安装 perl 及相关依赖，克隆工具仓库并进入目录；再通过 rip-svn.pl 脚本，以目标包含.svn 目录的 URL 为参数执行提取；完成后进入生成的本地仓库目录，查看提取出的版本库文件、历史记录等内容，从中寻找敏感信息，整个过程通过解析泄露的 SVN 目录结构自动重建仓库实现信息获取。
```
# 1. 安装dvcs-ripper（确保系统已安装perl及相关依赖）
sudo apt install -y perl libio-socket-ssl-perl libdbi-perl libdbd-mysql-perl
 
# 2. 克隆dvcs-ripper仓库
git clone https://github.com/kost/dvcs-ripper.git
cd dvcs-ripper
 
# 3. 利用rip-svn.pl脚本检测并提取SVN泄露（-u指定目标URL）
perl rip-svn.pl -u http://example.com/.svn/ 
# 工具会自动执行以下步骤：
# - 探测并下载SVN核心文件：entries, wc.db, pristine/ 等
# - 解析entries或wc.db文件获取版本库文件列表和校验和
# - 根据校验和从pristine/目录下载所有文件内容
# - 在本地重建完整的SVN工作副本，保存在以目标主机命名的目录中
# - 完成后可直接浏览下载的文件寻找配置文件、源代码和敏感信息
 
# 4. 进入生成的本地仓库目录（通常以目标域名命名）
cd example.com
 
# 5. 查看提取的SVN版本库内容，寻找敏感信息（如配置文件、历史提交记录）
ls -la
cat 敏感文件路径  # 例如：cat config.php 或查看日志文件
 
# 说明：整个过程通过解析目标网站暴露的.svn目录结构，自动下载版本库元数据、文件快照等，重建本地可访问的SVN仓库，便于挖掘泄露的敏感数据
```
#### 解题关键步骤
```
sudo ./rip-svn.pl -u http://challenge-fbc675f2c68c5419.sandbox.ctfhub.com:10800/.svn
```
```
grep -r "ctfhub" .svn/pristine/
```