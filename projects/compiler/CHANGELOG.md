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
