# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2025-11-03
### Changed
- Bumped visible version to `1.0.2` in `index.html`.

### Fixed
- 修复侧边栏在折叠后再次展开时被编辑区遮挡的问题（将侧栏改为覆盖式定位，并调整 z-index 与布局回流逻辑）。

### Added
- 主题持久化（`localStorage` 中的 `editorTheme`，页面与 Monaco 编辑器在加载时读取并应用）。
- 工具栏新增“打开本地文件”功能，支持扩展名：`.c, .cpp, .h, .hpp, .txt`，并在加载后根据扩展切换 Monaco 的语言模式（C / C++ / plaintext）。
- 默认示例代码替换为简单输出 `By ZJU C. He` 的示例，便于快速验证页面功能。


[Unreleased]: https://example.com/your-repo

## [1.0.3] - 2025-11-03
### Added
- 在编辑头部显示当前打开的文件名（当通过“打开本地文件”加载时更新）。
- 添加“另存为”按钮，允许将当前编辑器内容下载为本地文件（文件名为当前打开的文件名或 `main.c`）。

### Notes
- 版本号 `index.html` 已更新为 `1.0.3`。

## [1.0.4] - 2025-11-03
### Added
- 编辑器“未保存”状态指示：当编辑器内容发生变化时，文件名后会显示 `*` 并且状态显示为“未保存”；保存后会移除 `*` 并恢复“已保存”。

### Notes
- 版本号 `index.html` 已更新为 `1.0.4`。

## [1.1.4] - 2025-11-04
### Fixed
- 修复全屏按钮无效的问题：页面结构中缺失 `.frame` 容器导致脚本无法找到目标元素；已在 `index.html` 中加入 `.frame` 包裹并在脚本中加入安全回退（优先 `.frame`，其次 `.app`，最后 `document.documentElement`）。

### Notes
- 版本号 `index.html` 已更新为 `1.1.4`。

## [1.1.5] - 2025-11-04
### Fixed
- 修复因插入 `.frame` 后导致的首次布局问题：确保 `.frame` 与 `.editor-wrap` 拥有 `min-height:0` 与 `#editor` 的高度规则，使 Monaco 编辑器能够正确填充容器。
- 修复全屏按钮与工具栏交互可能失效的问题：为全屏按钮添加容错绑定（若初次绑定失败会在 `load` 时重绑定），并在页面 `load` / `resize` 时强制触发 `editor.layout()`，保证交互与渲染稳定。

### Notes
- 版本号 `index.html` 已更新为 `1.1.5`。

## [1.1.6] - 2025-11-04
### Fixed
- 侧栏展开时遮挡编辑区右上角保存状态与右下角按钮的问题：当侧栏展开（覆盖式定位）时，编辑器右侧会自动向左平移（使用 `.editor-wrap.with-sidebar` 添加 `margin-right`），折叠时恢复填充全宽。此修复避免了侧栏遮挡头部与工具栏控件。

### Notes
- 版本号 `index.html` 已更新为 `1.1.6`。

## [1.1.7] - 2025-11-04
### Fixed
- 将侧栏宽度抽象为 CSS 变量 `--sidebar-width`，并替换所有硬编码宽度；当侧栏折叠/展开时，立即触发 `editor.layout()` 并在过渡结束时再次触发，保证 Monaco 编辑器在每次切换都正确响应并填充可见区域。

### Notes
- 版本号 `index.html` 已更新为 `1.1.7`。
