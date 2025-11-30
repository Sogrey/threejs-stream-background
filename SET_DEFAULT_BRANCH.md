# GitHub 默认分支设置说明

## 当前状态
- 本地分支: main ✅
- 远程分支: main ✅ (已推送)
- GitHub默认分支: master (需要更改)

## 如何更改GitHub默认分支

### 方法1: 通过GitHub网页界面 (推荐)
1. 访问仓库页面: https://github.com/Sogrey/threejs-stream-background
2. 点击 "Settings" 标签页
3. 在左侧菜单中找到 "Branches" 选项
4. 在 "Default branch" 部分，点击切换按钮
5. 从下拉菜单选择 "main"
6. 确认更改

### 方法2: 通过GitHub API
```bash
curl -X PATCH \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Sogrey/threejs-stream-background \
  -d '{"default_branch":"main"}'
```

## 完成后的状态
- ✅ 本地和远程都使用 main 分支
- ✅ GitHub 默认分支设置为 main
- ✅ 所有新克隆和拉取都将使用 main

## 项目状态
- 🚀 构建成功: pnpm build 正常工作
- 🎯 功能完整: Three.js 粒子系统正常运行
- 📦 优化完成: Chunk大小已优化
- 🔧 TypeScript: 所有类型问题已解决

项目已完全准备就绪，只需要将GitHub默认分支改为main即可！