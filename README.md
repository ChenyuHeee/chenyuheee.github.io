# chenyuheee.github.io

这是你的 MkDocs 博客仓库。下面是常用命令和如何本地运行/部署的说明。

本地开发与预览

```bash
# 安装依赖（在 Python3 环境）
python3 -m pip install --user mkdocs mkdocs-material pymdown-extensions mkdocs-minify-plugin mkdocs-git-revision-date-localized-plugin mkdocs-mermaid2-plugin

# 本地预览（带热重载）
python3 -m mkdocs serve
# 打开 http://127.0.0.1:8000 查看
```

构建并部署（使用 GitHub Actions）

- 我已添加一个 workflow `.github/workflows/deploy-mkdocs.yml`，当你 push 到 `main` 分支时会构建并把 `site/` 发布到 `gh-pages` 分支。

快速构建（在本地）

```bash
python3 -m mkdocs build --clean
```

如果你想手动把 `site/` 推送到 `gh-pages`：

```bash
# 只在你想手动部署且确认 site/ 是正确的情况下执行
git checkout gh-pages
cp -R site/* .
git add -A
git commit -m "Manual deploy"
git push origin gh-pages
git checkout main
```

如何改回或启用 logo

- 把你的 logo 放到 `docs/images/logo.png`（或 `logo.svg`），然后取消 `mkdocs.yml` 中的注释 `theme.logo: images/logo.png`。

如需我自动提交并 push 更改以触发 Action，请回复 “提交并部署”；若要我先打开本地预览，请回复 “本地预览”。
