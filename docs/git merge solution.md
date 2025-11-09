# git merge solution
1.查看当前分支
```
git branch --show-current
```
2.看有哪些未推送/未拉取
```
git fetch origin
git status
git log --oneline --decorate --graph --all | head -20
```
## 安全解决（rebase保持线性历史）
```
git fetch origin
git pull --rebase origin main
```
出现冲突
```
git add <冲突文件...>
git rebase --continue
```
rebase结束
```
git push origin main
```