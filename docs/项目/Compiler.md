---
title: 在线编译器设计体验
date: 2025-11-03 19:28:22
tags: 项目
---
# 在线编译器设计体验

-------
[点击此处-项目呈现](/c)   |   [点击查看更新日志](/c/CHANGELOG.md)
-------
## 设计思路
- 整体布局：
    - 主界面代码编辑器
    - 顶部工具栏
    - 侧边栏（输入输出）
- 代码编辑器：
    使用Monaco Editor（VS Code的编辑器核心）实现C语言语法高亮
- 编译功能：
    通过后端API调用编译器（如GCC）执行代码
- 响应式设计：
    适配不同屏幕尺寸
## 实现方式
- Github Pages搭建
- 调用编译器api
- 大模型补足
## 具体实践
### 1.Github Pages搭建
内置在博客网站内
```
/compiler/
```
### 2.通过大模型实现基本需求
#### Deepseek生成最初版本
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C语言在线编译器</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            flex: 1;
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        
        header {
            background: #2c3e50;
            color: white;
            padding: 15px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo i {
            font-size: 24px;
            color: #3498db;
        }
        
        .logo h1 {
            font-size: 24px;
            font-weight: 600;
        }
        
        .main-content {
            display: flex;
            flex: 1;
            height: calc(100vh - 150px);
        }
        
        .editor-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #e0e0e0;
        }
        
        .editor-header {
            padding: 10px 15px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .editor-header h2 {
            font-size: 18px;
            color: #2c3e50;
        }
        
        #editor {
            flex: 1;
            min-height: 400px;
        }
        
        .toolbar {
            padding: 10px 15px;
            background: #f5f5f5;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .btn-success {
            background: #2ecc71;
            color: white;
        }
        
        .btn-success:hover {
            background: #27ae60;
            transform: translateY(-2px);
        }
        
        .btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        .btn-danger:hover {
            background: #c0392b;
            transform: translateY(-2px);
        }
        
        .sidebar {
            width: 400px;
            display: flex;
            flex-direction: column;
            background: #f9f9f9;
            transition: transform 0.3s ease;
        }
        
        .sidebar.hidden {
            transform: translateX(100%);
        }
        
        .sidebar-header {
            padding: 10px 15px;
            background: #34495e;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .sidebar-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .sidebar-section:last-child {
            border-bottom: none;
        }
        
        .section-header {
            padding: 10px 15px;
            background: #ecf0f1;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 500;
            color: #2c3e50;
        }
        
        .section-content {
            flex: 1;
            padding: 15px;
            overflow: auto;
        }
        
        textarea {
            width: 100%;
            height: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: none;
            font-family: monospace;
        }
        
        .output {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            height: 100%;
            overflow: auto;
            font-family: monospace;
            white-space: pre-wrap;
        }
        
        .toggle-sidebar {
            position: absolute;
            right: 20px;
            top: 80px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .toggle-sidebar:hover {
            background: #2980b9;
            transform: scale(1.1);
        }
        
        footer {
            text-align: center;
            padding: 15px;
            background: #2c3e50;
            color: #ecf0f1;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: 40%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-code"></i>
                <h1>C语言在线编译器</h1>
            </div>
            <div class="header-info">
                <span>安全、快速、便捷的在线C语言编程环境</span>
            </div>
        </header>
        
        <div class="main-content">
            <div class="editor-container">
                <div class="editor-header">
                    <h2><i class="fas fa-file-code"></i> 代码编辑器 (main.c)</h2>
                    <div class="editor-actions">
                        <span class="status">已保存</span>
                    </div>
                </div>
                <div id="editor"></div>
                <div class="toolbar">
                    <button class="btn btn-primary" id="compileBtn">
                        <i class="fas fa-play"></i> 编译运行
                    </button>
                    <button class="btn btn-success" id="saveBtn">
                        <i class="fas fa-save"></i> 保存代码
                    </button>
                    <button class="btn btn-danger" id="resetBtn">
                        <i class="fas fa-redo"></i> 重置代码
                    </button>
                    <div style="flex: 1"></div>
                    <button class="btn" id="themeToggle">
                        <i class="fas fa-moon"></i> 切换主题
                    </button>
                </div>
            </div>
            
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h3><i class="fas fa-terminal"></i> 运行结果</h3>
                    <button id="closeSidebar"><i class="fas fa-times"></i></button>
                </div>
                <div class="sidebar-section">
                    <div class="section-header">
                        <i class="fas fa-keyboard"></i> 标准输入 (stdin)
                    </div>
                    <div class="section-content">
                        <textarea id="input" placeholder="在此输入程序运行所需的输入...">10 20</textarea>
                    </div>
                </div>
                <div class="sidebar-section">
                    <div class="section-header">
                        <i class="fas fa-desktop"></i> 输出结果 (stdout)
                    </div>
                    <div class="section-content">
                        <div class="output" id="output">程序输出将显示在这里...</div>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="toggle-sidebar" id="toggleSidebar">
            <i class="fas fa-chevron-left"></i>
        </button>
        
        <footer>
            <p>C语言在线编译器 &copy; 2023 | 基于Monaco Editor构建 | 安全提示：请勿上传敏感信息</p>
        </footer>
    </div>

    <script>
        // 初始化Monaco Editor
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
            // 默认C语言代码
            const defaultCode = `#include <stdio.h>

int main() {
    int a, b, sum;
    
    printf("请输入两个整数：\\n");
    scanf("%d %d", &a, &b);
    
    sum = a + b;
    
    printf("两数之和为：%d\\n", sum);
    
    return 0;
}`;

            // 创建编辑器实例
            window.editor = monaco.editor.create(document.getElementById('editor'), {
                value: defaultCode,
                language: 'c',
                theme: 'vs-light',
                fontSize: 14,
                minimap: { enabled: true },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                lineNumbers: 'on',
                folding: true,
                wordWrap: 'on'
            });
            
            // 添加窗口大小变化时的自适应
            window.addEventListener('resize', function() {
                window.editor.layout();
            });
        });
        
        // DOM元素
        const compileBtn = document.getElementById('compileBtn');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const themeToggle = document.getElementById('themeToggle');
        const toggleSidebar = document.getElementById('toggleSidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        
        // 编译按钮事件
        compileBtn.addEventListener('click', function() {
            output.textContent = "编译中...";
            sidebar.classList.remove('hidden');
            toggleSidebar.querySelector('i').className = 'fas fa-chevron-right';
            
            // 模拟编译过程
            setTimeout(function() {
                const code = window.editor.getValue();
                const userInput = input.value;
                
                // 简单模拟编译结果
                if (code.includes('scanf') && userInput.trim() === '') {
                    output.textContent = "错误: 程序需要输入但未提供输入数据";
                    return;
                }
                
                // 模拟程序输出
                if (userInput.trim() !== '') {
                    const inputs = userInput.split(' ');
                    if (inputs.length >= 2) {
                        const a = parseInt(inputs[0]);
                        const b = parseInt(inputs[1]);
                        output.textContent = `请输入两个整数：\n两数之和为：${a + b}`;
                    } else {
                        output.textContent = "错误: 输入格式不正确，请输入两个整数";
                    }
                } else {
                    output.textContent = "请输入两个整数：\n两数之和为：30";
                }
            }, 1500);
        });
        
        // 保存按钮事件
        saveBtn.addEventListener('click', function() {
            const status = document.querySelector('.status');
            status.textContent = "已保存";
            status.style.color = "#2ecc71";
            
            setTimeout(() => {
                status.textContent = "已保存";
                status.style.color = "";
            }, 2000);
            
            // 在实际应用中，这里应该将代码保存到服务器或本地存储
            localStorage.setItem('savedCCode', window.editor.getValue());
        });
        
        // 重置按钮事件
        resetBtn.addEventListener('click', function() {
            if (confirm("确定要重置代码吗？所有未保存的更改将丢失。")) {
                window.editor.setValue(defaultCode);
            }
        });
        
        // 主题切换
        themeToggle.addEventListener('click', function() {
            const currentTheme = monaco.editor.getTheme();
            if (currentTheme === 'vs-light') {
                monaco.editor.setTheme('vs-dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> 切换主题';
                document.body.style.background = 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
            } else {
                monaco.editor.setTheme('vs-light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> 切换主题';
                document.body.style.background = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)';
            }
        });
        
        // 侧边栏切换
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
            const icon = toggleSidebar.querySelector('i');
            if (sidebar.classList.contains('hidden')) {
                icon.className = 'fas fa-chevron-left';
            } else {
                icon.className = 'fas fa-chevron-right';
            }
        });
        
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.add('hidden');
            toggleSidebar.querySelector('i').className = 'fas fa-chevron-left';
        });
        
        // 从本地存储加载已保存的代码
        window.addEventListener('load', function() {
            const savedCode = localStorage.getItem('savedCCode');
            if (savedCode) {
                window.editor.setValue(savedCode);
            }
        });
    </script>
</body>
</html>
```
该版本已实现：
- 代码编辑器：
    - 基于Monaco Editor，提供完整的C语言语法高亮
    - 支持代码折叠、行号显示、自动换行等功能
    - 主题切换（亮色/暗色）
    - ~~真正的编译运行~~
- 工具栏功能：
    - 编译运行：执行代码并显示结果
    - 保存代码：将代码保存到本地存储
    - 重置代码：恢复默认代码示例
    - 主题切换：切换编辑器主题
- 侧边栏：
    - 标准输入区域：提供程序运行所需的输入
    - 输出结果区域：显示程序执行结果
    - 可展开/折叠的侧边栏设计
- 响应式设计：
    - 适配不同屏幕尺寸，在移动设备上自动调整布局
##### 学习收获
1. **前端技术整合** - 将Monaco Editor集成到网页中实现专业代码编辑体验
2. **UI/UX设计** - 设计直观的编译器界面，合理布局编辑区与结果展示区
3. **交互逻辑** - 实现代码编译、保存、重置等功能的完整用户流程
4. **响应式设计** - 确保网站在不同设备上都能良好显示
5. **项目规划** - 从需求分析到功能实现的完整开发流程

#### GPT-5优化
目标：
- 美化界面
- 精简代码
- 增添注释帮助学习理解
代码实现：
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>C 语言在线编译器（简洁版）</title>
    <!-- 字体图标和 Monaco 加载器 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.js"></script>

    <style>
        /* 主题变量，便于快速定制 */
        :root{
            --bg-start: #1a2a6c;
            --bg-mid: #b21f1f;
            --bg-end: #fdbb2d;
            --card-bg: rgba(255,255,255,0.98);
            --primary: #3498db;
            --muted: #6b7280;
            --shadow: 0 10px 30px rgba(0,0,0,0.15);
            --radius: 10px;
        }

        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif}

        body{
            background:linear-gradient(135deg,var(--bg-start),var(--bg-mid),var(--bg-end));
            display:flex;align-items:stretch;justify-content:center;padding:20px;
        }

        /* 容器 */
        .app{
            width:100%;max-width:1200px;background:var(--card-bg);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 40px);
        }

        header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#223247;color:#fff}
        header .title{display:flex;align-items:center;gap:12px;font-weight:600}
        header .title i{color:var(--primary);font-size:20px}
        header .meta{color:var(--muted);font-size:13px}

        /* 主区：编辑器 + 侧栏 */
        .main{flex:1;display:flex;min-height:0}

        /* 编辑区 */
        .editor-wrap{flex:1;display:flex;flex-direction:column;border-right:1px solid #eee}
        .editor-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#fafafa;border-bottom:1px solid #eee}
        .editor-head h2{font-size:15px;color:#243b53}
        #editor{flex:1;min-height:200px}

        /* 工具栏 */
        .toolbar{display:flex;gap:8px;padding:10px 14px;background:#fafafa;border-top:1px solid #eee;align-items:center}
        .btn{border:0;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:8px}
        .btn-primary{background:var(--primary);color:#fff}
        .btn-ghost{background:transparent;border:1px solid #e6e6e6}

        /* 侧栏 */
        .sidebar{width:360px;display:flex;flex-direction:column;background:#f7f9fb}
        .sb-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#2f4356;color:#fff}
        .sb-section{padding:12px 14px;flex:1;overflow:auto}
        textarea,input[type=text]{width:100%;padding:10px;border:1px solid #e3e8ee;border-radius:6px;font-family:monospace}
        .output{background:#0f1b2a;color:#dfefff;padding:12px;border-radius:6px;white-space:pre-wrap;height:100%;overflow:auto;font-family:monospace}

        /* 小屏适配 */
        @media (max-width:900px){
            .main{flex-direction:column}
            .sidebar{width:100%;height:38%}
            .editor-wrap{border-right:0}
        }
    </style>
</head>
<body>
    <div class="app">
        <header>
            <div class="title"><i class="fas fa-code"></i><div>C 语言在线编译器</div></div>
            <div class="meta">安全提醒：此页面仅做演示，本地运行即可</div>
        </header>

        <div class="main">
            <div class="editor-wrap">
                <div class="editor-head">
                    <h2><i class="fas fa-file-code"></i> main.c</h2>
                    <div class="status" id="saveStatus">已保存</div>
                </div>

                <div id="editor"></div>

                <div class="toolbar">
                    <button class="btn btn-primary" id="runBtn"><i class="fas fa-play"></i> 运行</button>
                    <button class="btn btn-ghost" id="saveBtn"><i class="fas fa-save"></i> 保存</button>
                    <button class="btn btn-ghost" id="resetBtn"><i class="fas fa-undo"></i> 重置</button>
                    <div style="flex:1"></div>
                    <button class="btn btn-ghost" id="themeBtn"><i class="fas fa-moon"></i> 主题</button>
                </div>
            </div>

            <aside class="sidebar" id="sidebar">
                <div class="sb-head"><div><i class="fas fa-terminal"></i> 运行结果</div><button id="closeSb" class="btn btn-ghost">关闭</button></div>
                <div class="sb-section">
                    <label>标准输入 (stdin)</label>
                    <textarea id="stdin" rows="3" placeholder="例如：10 20">10 20</textarea>
                    <div style="height:12px"></div>
                    <label>输出 (stdout)</label>
                    <div class="output" id="stdout">程序输出将显示在这里...</div>
                </div>
            </aside>
        </div>
    </div>

    <script>
        /**********************************************************************
         * 简洁版脚本：功能
         * - 初始化 Monaco 编辑器
         * - 本地保存/加载代码（localStorage）
         * - 简单运行（模拟 scanf/printf）
         * - 主题切换与 UI 状态更新
         * 所有注释为中文，便于维护。
         **********************************************************************/

        // 默认代码（保持与 UI 功能一致的示例）
        const DEFAULT_CODE = `#include <stdio.h>

int main() {
    int a, b;
    // 读取两个整数并输出和
    if (scanf("%d %d", &a, &b) == 2) {
        printf("两数之和为：%d\n", a + b);
    } else {
        printf("输入格式错误\n");
    }
    return 0;
}`;

        // DOM 引用
        const runBtn = document.getElementById('runBtn');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const themeBtn = document.getElementById('themeBtn');
        const stdinEl = document.getElementById('stdin');
        const stdoutEl = document.getElementById('stdout');
        const saveStatus = document.getElementById('saveStatus');
        const closeSb = document.getElementById('closeSb');

        // Monaco 编辑器需要异步加载
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            // 尝试从 localStorage 加载之前保存的代码
            const saved = localStorage.getItem('deepseek_saved_c');
            window.editor = monaco.editor.create(document.getElementById('editor'), {
                value: saved || DEFAULT_CODE,
                language: 'c',
                theme: 'vs-light',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false
            });

            // 快捷键：Ctrl/Cmd+S 保存
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    e.preventDefault(); saveCode();
                }
            });
        });

        // ----------------- 功能函数 -----------------
        // 保存当前编辑器内容到 localStorage，并提示状态
        function saveCode() {
            if (!window.editor) return;
            localStorage.setItem('deepseek_saved_c', window.editor.getValue());
            saveStatus.textContent = '已保存';
            saveStatus.style.color = '#22c55e';
            setTimeout(() => { saveStatus.style.color = ''; }, 1200);
        }

        // 将编辑器内容重置为默认代码（不会清除 localStorage）
        function resetCode() {
            if (!window.editor) return;
            if (!confirm('确定重置代码？未保存的更改将丢失。')) return;
            window.editor.setValue(DEFAULT_CODE);
        }

        // 简单“运行”函数：模拟 scanf/printf 的行为，仅用于演示
        // - 如果代码包含 scanf 且 stdin 为空，则提示错误
        // - 否则把 stdin 按空白拆分为整数并输出和
        function runCode() {
            if (!window.editor) return;
            stdoutEl.textContent = '运行中...';

            // 模拟异步运行（更真实的体验）
            setTimeout(() => {
                const code = window.editor.getValue();
                const input = (stdinEl.value || '').trim();

                if (/scanf\s*\(/.test(code) && input === '') {
                    stdoutEl.textContent = '错误：程序需要输入但未提供 stdin。';
                    return;
                }

                if (input === '') {
                    // 没有输入：展示友好示例输出
                    stdoutEl.textContent = '提示：请在左侧输入两个整数，例如：10 20';
                    return;
                }

                const parts = input.split(/\s+/).map(s => parseInt(s, 10));
                if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) {
                    const [a, b] = parts;
                    stdoutEl.textContent = `两数之和为：${a + b}`;
                } else {
                    stdoutEl.textContent = '错误：输入格式不正确，请输入两个整数（例如：10 20）';
                }
            }, 400);
        }

        // 切换主题（轻/暗）
        let isDark = false;
        function toggleTheme() {
            if (!window.monaco) { /* monaco 可能尚未加载 */ }
            isDark = !isDark;
            try {
                monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
            } catch (e) { /* ignore */ }
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> 明亮' : '<i class="fas fa-moon"></i> 暗色';
        }

        // ----------------- 事件绑定 -----------------
        runBtn.addEventListener('click', runCode);
        saveBtn.addEventListener('click', saveCode);
        resetBtn.addEventListener('click', resetCode);
        themeBtn.addEventListener('click', toggleTheme);
        closeSb.addEventListener('click', () => { document.getElementById('sidebar').style.display = 'none'; });

        // 页面卸载时自动保存（可选）
        window.addEventListener('beforeunload', () => {
            if (window.editor) localStorage.setItem('deepseek_saved_c', window.editor.getValue());
        });
    </script>
</body>
</html>
```
增添功能：
保存：保存到 `localStorage `键 `deepseek_saved_c`，并在窗口关闭前自动保存一次（防止意外关闭丢失）。
**学习收获**
在GPT的帮助下阅读代码，理解更多css变量等形式

### 初具雏形
外观与ui设计在手动调整（如取色、位置等参数）后，符合需求
代码展示：
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>C 语言在线编译器（简洁版）</title>
    <!-- 字体图标和 Monaco 加载器 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.js"></script>

    <style>
        /* 暗黑优先 - 极简 mac 风格 */
        :root{
            --bg: #0b0c0d;           /* 页面背景（near black） */
            --panel: #0f1113;        /* 卡片 / 主容器背景 */
            --muted: #9aa4ad;        /* 次要文字 */
            --accent: #48a0ff;       /* 高亮色（适度） */
            --glass: rgba(255,255,255,0.02);
            --radius: 10px;
            --shadow: 0 8px 30px rgba(0,0,0,0.6);
        }

        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial}
        body{background:var(--bg);color:#e6eef6;}

        /* 应用容器：占满整个视口，类似本地 app 的全屏编辑器 */
        .app{height:100vh;width:100vw;display:flex;flex-direction:column;align-items:stretch;justify-content:stretch}
        .frame{max-width:1400px;margin:12px auto;flex:1;background:var(--panel);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column}

        header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent)}
        header .title{display:flex;align-items:center;gap:10px;font-weight:600}
        header .title i{color:var(--accent);font-size:18px}
        header .meta{color:var(--muted);font-size:13px}

        /* 主区：编辑器 + 侧栏 */
        .main{flex:1;display:flex;min-height:0}

        /* 编辑区 */
        .editor-wrap{flex:1;display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,0.03)}
        .editor-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px}
        .editor-head h2{font-size:14px;color:#dbe9ff}
        #editor{flex:1;min-height:200px}

        /* 工具栏 */
        .toolbar{display:flex;gap:8px;padding:10px 14px;align-items:center}
        .btn{border:0;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:8px;background:transparent;color:#e6eef6}
        .btn.primary{background:var(--accent);color:#071022}
        .btn.ghost{border:1px solid rgba(255,255,255,0.04)}

        /* 侧栏 */
        .sidebar{width:380px;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(255,255,255,0.01),transparent)}
        .sidebar.collapsed{transform:translateX(100%);transition:transform .28s ease}
        .sb-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px}
        .sb-section{padding:12px 14px;flex:1;overflow:auto}
        textarea,input[type=text]{width:100%;padding:10px;border:1px solid rgba(255,255,255,0.03);border-radius:8px;background:transparent;color:#e6eef6;font-family:monospace}
        .output{background:var(--glass);color:#dfefff;padding:12px;border-radius:8px;white-space:pre-wrap;height:100%;overflow:auto;font-family:monospace}

        /* 悬浮的侧边栏切换按钮（当侧栏折叠时可恢复） */
        #sidebarToggle{position:fixed;right:18px;bottom:24px;width:44px;height:44px;border-radius:10px;background:var(--panel);border:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;color:var(--accent);box-shadow:var(--shadow);cursor:pointer}

        /* 小屏适配 */
        @media (max-width:900px){
            .main{flex-direction:column}
            .sidebar{width:100%;height:34%}
            .editor-wrap{border-right:0}
        }
    </style>
</head>
<body>
    <div class="app">
        <header>
            <div class="title"><i class="fas fa-code"></i><div>C 语言在线编译器</div></div>
            <div class="meta">安全提醒：此页面仅做演示，本地运行即可</div>
        </header>

        <div class="main">
            <div class="editor-wrap">
                <div class="editor-head">
                    <h2><i class="fas fa-file-code"></i> main.c</h2>
                    <div class="status" id="saveStatus">已保存</div>
                </div>

                <div id="editor"></div>

                <div class="toolbar">
                    <button class="btn primary" id="runBtn"><i class="fas fa-play"></i> 运行</button>
                    <button class="btn ghost" id="saveBtn"><i class="fas fa-save"></i> 保存</button>
                    <button class="btn ghost" id="resetBtn"><i class="fas fa-undo"></i> 重置</button>
                    <button class="btn ghost" id="fsBtn" title="全屏"><i class="fas fa-expand"></i></button>
                    <div style="flex:1"></div>
                    <button class="btn ghost" id="themeBtn"><i class="fas fa-sun"></i> 主题</button>
                </div>
            </div>

            <aside class="sidebar" id="sidebar">
                <div class="sb-head"><div><i class="fas fa-terminal"></i> 运行结果</div><button id="closeSb" class="btn ghost">折叠</button></div>
                <div class="sb-section">
                    <label>标准输入 (stdin)</label>
                    <textarea id="stdin" rows="3" placeholder="例如：10 20">10 20</textarea>
                    <div style="height:12px"></div>
                    <label>输出 (stdout)</label>
                    <div class="output" id="stdout">程序输出将显示在这里...</div>
                </div>
            </aside>
        </div>
    </div>

    <!-- 折叠后恢复侧栏的悬浮按钮 -->
    <div id="sidebarToggle" title="打开侧栏"><i class="fas fa-chevron-left"></i></div>

    <script>
        /**********************************************************************
         * 简洁版脚本：功能
         * - 初始化 Monaco 编辑器
         * - 本地保存/加载代码（localStorage）
         * - 简单运行（模拟 scanf/printf）
         * - 主题切换与 UI 状态更新
         * 所有注释为中文，便于维护。
         **********************************************************************/

        // 默认代码（保持与 UI 功能一致的示例）
        const DEFAULT_CODE = `#include <stdio.h>

int main() {
    int a, b;
    // 读取两个整数并输出和
    if (scanf("%d %d", &a, &b) == 2) {
        printf("两数之和为：%d\n", a + b);
    } else {
        printf("输入格式错误\n");
    }
    return 0;
}`;

        // DOM 引用
        const runBtn = document.getElementById('runBtn');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const themeBtn = document.getElementById('themeBtn');
        const stdinEl = document.getElementById('stdin');
        const stdoutEl = document.getElementById('stdout');
        const saveStatus = document.getElementById('saveStatus');
        const closeSb = document.getElementById('closeSb');

        // Monaco 编辑器需要异步加载
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            // 尝试从 localStorage 加载之前保存的代码
            const saved = localStorage.getItem('deepseek_saved_c');
            window.editor = monaco.editor.create(document.getElementById('editor'), {
                value: saved || DEFAULT_CODE,
                language: 'c',
                theme: 'vs-light',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false
            });

            // 快捷键：Ctrl/Cmd+S 保存
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    e.preventDefault(); saveCode();
                }
            });
        });

    // ----------------- 功能函数 -----------------
        // 保存当前编辑器内容到 localStorage，并提示状态
        function saveCode() {
            if (!window.editor) return;
            localStorage.setItem('deepseek_saved_c', window.editor.getValue());
            saveStatus.textContent = '已保存';
            saveStatus.style.color = '#22c55e';
            setTimeout(() => { saveStatus.style.color = ''; }, 1200);
        }

        // 将编辑器内容重置为默认代码（不会清除 localStorage）
        function resetCode() {
            if (!window.editor) return;
            if (!confirm('确定重置代码？未保存的更改将丢失。')) return;
            window.editor.setValue(DEFAULT_CODE);
        }

        // runCode: 优先调用后端编译器 API；若网络或后端不可用则回退到本地模拟
        // 后端 API 约定（示例）：
        // POST /api/compile  body: { language: 'c', code: string, stdin: string }
        // 返回: { stdout: string, stderr: string, exitCode: number }
        async function runCode() {
            if (!window.editor) return;
            stdoutEl.textContent = '运行中（尝试后端编译）...';

            const code = window.editor.getValue();
            const stdin = (stdinEl.value || '').trim();

            // 如果后端地址不可用或超时，回退到本地模拟
            const backendUrl = '/api/compile'; // 请在后端服务中实现此路由

            // 超时辅助函数
            const fetchWithTimeout = (url, opts, timeout = 10000) => {
                return Promise.race([
                    fetch(url, opts),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeout))
                ]);
            };

            try {
                const resp = await fetchWithTimeout(backendUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ language: 'c', code, stdin })
                }, 10000);

                if (!resp.ok) throw new Error('后端返回错误: ' + resp.status);
                const data = await resp.json();

                // 根据后端返回渲染输出（约定字段：stdout/stderr/exitCode）
                let out = '';
                if (data.stdout) out += data.stdout;
                if (data.stderr) out += '\n[stderr]\n' + data.stderr;
                out += `\n[exit code] ${data.exitCode ?? 0}`;
                stdoutEl.textContent = out.trim();
                return;
            } catch (e) {
                // 后端不可用或超时，回退到本地模拟
                console.warn('后端编译失败，回退到本地模拟：', e);
                simulateRun(code, stdin);
            }
        }

        // 本地回退：简单模拟 scanf/printf 行为（仅作演示）
        function simulateRun(code, input) {
            stdoutEl.textContent = '本地模拟运行...';
            setTimeout(() => {
                if (/scanf\s*\(/.test(code) && (!input || input.trim() === '')) {
                    stdoutEl.textContent = '错误：程序需要输入但未提供 stdin。';
                    return;
                }

                if (!input || input.trim() === '') {
                    stdoutEl.textContent = '提示：请在左侧输入两个整数，例如：10 20';
                    return;
                }

                const parts = input.split(/\s+/).map(s => parseInt(s, 10));
                if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) {
                    const [a, b] = parts;
                    stdoutEl.textContent = `两数之和为：${a + b}`;
                } else {
                    stdoutEl.textContent = '错误：输入格式不正确，请输入两个整数（例如：10 20）';
                }
            }, 300);
        }

        // 切换主题（轻/暗），默认暗黑
        let isDark = true;
        function toggleTheme() {
            isDark = !isDark;
            try { monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light'); } catch (e) {}
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> 明亮' : '<i class="fas fa-moon"></i> 暗色';
        }

        // ----------------- 事件绑定 -----------------
        runBtn.addEventListener('click', runCode);
        saveBtn.addEventListener('click', saveCode);
        resetBtn.addEventListener('click', resetCode);
        themeBtn.addEventListener('click', toggleTheme);

        // 侧栏折叠/展开逻辑：使用 class 'collapsed'，便于动画与恢复
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        closeSb.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
            sidebarToggle.style.display = 'flex';
        });
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            sidebarToggle.style.display = 'none';
        });

        // 全屏按钮
        const fsBtn = document.getElementById('fsBtn');
        fsBtn.addEventListener('click', () => {
            const el = document.querySelector('.frame');
            if (!document.fullscreenElement) {
                el.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        });

        // 页面卸载时自动保存（可选）
        window.addEventListener('beforeunload', () => {
            if (window.editor) localStorage.setItem('deepseek_saved_c', window.editor.getValue());
        });

        // 页面加载时：设置编辑器为暗黑主题（若 monaco 已加载则在创建时设置，若晚加载则尝试设置）
        window.addEventListener('load', () => {
            try { if (window.monaco) monaco.editor.setTheme('vs-dark'); } catch (e) {}
            // 初始时隐藏侧栏恢复按钮（默认展开）
            document.getElementById('sidebarToggle').style.display = 'none';
        });
    </script>
</body>
</html>
```
**后续目标**
用VS Code中的copilot Agent模式为我规划整个项目，尝试接入真实的编译后端。
### 遇到问题
*GitHub Pages 只托管静态文件，不能运行编译后端，所以你必须额外部署或使用第三方服务来执行编译/运行。*
Github Actions可以实现编译，但是延迟时间过长，实用效果不佳
**解决方案**
1. 使用 Judge0（托管版或自托管开源 Judge0）

概要：Judge0 是流行的在线评测 API（支持多语言）。你可以直接调用 Judge0 提供的 API（托管/付费），或在自己的 VPS 上用 Docker Compose 自托管 Judge0 服务。
优点：成熟、支持多语言、接口简单（HTTP API）、支持限制运行时/内存/时间、开箱即用；自托管可完全控制。
缺点：托管版受限于配额/费用；自托管需要 VPS + Docker，需注意安全与资源隔离（容器逃逸风险）。
成本：托管版按请求/配额付费；自托管仅 VPS 成本（例如 $5–20/月 取决使用量）。
推荐场景：想要快速上线且需要多语言/稳定接口 → 推荐托管 Judge0；想完全控制并能运维 → 自托管 Judge0（我会提供 Docker Compose 示例）。

2. 后端容器化服务（自建安全沙箱）

概要：在 VPS、云虚拟机或容器服务（Fargate）上运行自己的编译器服务。每次执行都在容器或轻量 VM（gVisor、Firecracker）内运行，或使用已有的 sandbox 项目（isolate、nsjail）。
优点：最灵活，可自定义编译器版本、环境、插件；更容易做白名单/定制化；适合企业级需求。
缺点：实现复杂、运维成本高、必须正确隔离以避免被利用执行任意代码。
成本：云实例 + 容器运行费用；如果使用 Firecracker 或 Fargate 成本更高。
推荐场景：对安全/自定义/扩展性有高要求，且有运维能力。

3. Serverless 容器/函数（AWS Lambda（容器）、Google Cloud Run）

概要：把编译器打包为容器镜像，部署到 Cloud Run 或 Lambda（Container Image）等按需执行的平台。
优点：按调用计费，自动伸缩，运维负担低；可以结合短暂隔离的容器执行。
缺点：启动冷启动、执行时间和资源受限（Lambda 默认最多 15 分钟，且内存/磁盘限制），需要处理容器层面的安全隔离；成本随并发上涨。
推荐场景：中等流量、希望少运维但接受平台约束时。

4. 在浏览器里运行编译器（WASM）

概要：使用 WebAssembly 版本的编译器（如 clang/emscripten 的 Wasm 构建，或 tcc-wasm / clang.wasm）在用户浏览器中直接编译并运行（WASI 可用时）。
优点：无需后端、零延迟、无需你维护服务器、对用户更隐私安全（代码在本地运行）；适合教育、演示或小型程序。
缺点：WASM 二进制较大（可能几十 MB），某些系统调用或库不可用，运行受浏览器环境限制（不能做全部系统交互），对复杂/长时任务不理想。
推荐场景：你需要零运维、演示性质或能接受功能限制时（例如仅做 C 语言的简单运行示例）。

5. 使用第三方付费 SaaS（如 Replit、Glot.io、某些 API 市场上的编译服务）

概要：直接调用商业提供方的 REST API 来编译/运行代码。
优点：开发最快、运维几乎为零、通常带 SLA 支持。
缺点：受限于价格和配额、需要信任第三方处理用户代码（隐私/合规问题）。
推荐场景：对可靠性/快速上线要求高且能接受付费。

**最终选择**
直接集成 Wandbox（方案 B）并实现回退到 WASM（双重策略）——我会把 runCode 编写为：try Wandbox via fetch -> 若成功显示结果；若 fetch 报错（含 CORS）或超时则调用本地 wasm（如果存在）或本地模拟。优点：优先真实编译器，且无需服务器（若 Wandbox CORS 可用）。我会给出完整的前端 fetch 实现、超时处理与错误提示。

代码呈现
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>C 语言在线编译器（简洁版）</title>
    <!-- 字体图标和 Monaco 加载器 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.js"></script>

    <style>
        /* 暗黑优先 - 极简 mac 风格 */
        :root{
            --bg: #0b0c0d;           /* 页面背景（near black） */
            --panel: #0f1113;        /* 卡片 / 主容器背景 */
            --muted: #9aa4ad;        /* 次要文字 */
            --accent: #48a0ff;       /* 高亮色（适度） */
            --glass: rgba(255,255,255,0.02);
            --radius: 10px;
            --shadow: 0 8px 30px rgba(0,0,0,0.6);
        }

        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial}
        body{background:var(--bg);color:#e6eef6;}

        /* 应用容器：占满整个视口，类似本地 app 的全屏编辑器 */
        .app{height:100vh;width:100vw;display:flex;flex-direction:column;align-items:stretch;justify-content:stretch}
        .frame{max-width:1400px;margin:12px auto;flex:1;background:var(--panel);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column}

        header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent)}
        header .title{display:flex;align-items:center;gap:10px;font-weight:600}
        header .title i{color:var(--accent);font-size:18px}
        header .meta{color:var(--muted);font-size:13px}

        /* 主区：编辑器 + 侧栏 */
        .main{flex:1;display:flex;min-height:0}

        /* 编辑区 */
        .editor-wrap{flex:1;display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,0.03)}
        .editor-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px}
        .editor-head h2{font-size:14px;color:#dbe9ff}
        #editor{flex:1;min-height:200px}

        /* 工具栏 */
        .toolbar{display:flex;gap:8px;padding:10px 14px;align-items:center}
        .btn{border:0;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:8px;background:transparent;color:#e6eef6}
        .btn.primary{background:var(--accent);color:#071022}
        .btn.ghost{border:1px solid rgba(255,255,255,0.04)}

        /* 侧栏 */
        .sidebar{width:380px;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(255,255,255,0.01),transparent)}
        .sidebar.collapsed{transform:translateX(100%);transition:transform .28s ease}
        .sb-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px}
        .sb-section{padding:12px 14px;flex:1;overflow:auto}
        textarea,input[type=text]{width:100%;padding:10px;border:1px solid rgba(255,255,255,0.03);border-radius:8px;background:transparent;color:#e6eef6;font-family:monospace}
        .output{background:var(--glass);color:#dfefff;padding:12px;border-radius:8px;white-space:pre-wrap;height:100%;overflow:auto;font-family:monospace}

        /* 悬浮的侧边栏切换按钮（当侧栏折叠时可恢复） */
        #sidebarToggle{position:fixed;right:18px;bottom:24px;width:44px;height:44px;border-radius:10px;background:var(--panel);border:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;color:var(--accent);box-shadow:var(--shadow);cursor:pointer}

        /* 小屏适配 */
        @media (max-width:900px){
            .main{flex-direction:column}
            .sidebar{width:100%;height:34%}
            .editor-wrap{border-right:0}
        }
    </style>
</head>
<body>
    <div class="app">
        <header>
            <div class="title"><i class="fas fa-code"></i><div>C 语言在线编译器</div></div>
            <div class="meta">安全提醒：此页面仅做演示，本地运行即可</div>
        </header>

        <div class="main">
            <div class="editor-wrap">
                <div class="editor-head">
                    <h2><i class="fas fa-file-code"></i> main.c</h2>
                    <div class="status" id="saveStatus">已保存</div>
                </div>

                <div id="editor"></div>

                <div class="toolbar">
                    <button class="btn primary" id="runBtn"><i class="fas fa-play"></i> 运行</button>
                    <button class="btn ghost" id="saveBtn"><i class="fas fa-save"></i> 保存</button>
                    <button class="btn ghost" id="resetBtn"><i class="fas fa-undo"></i> 重置</button>
                    <button class="btn ghost" id="fsBtn" title="全屏"><i class="fas fa-expand"></i></button>
                    <div style="flex:1"></div>
                    <button class="btn ghost" id="themeBtn"><i class="fas fa-sun"></i> 主题</button>
                </div>
            </div>

            <aside class="sidebar" id="sidebar">
                <div class="sb-head"><div><i class="fas fa-terminal"></i> 运行结果</div><button id="closeSb" class="btn ghost">折叠</button></div>
                <div class="sb-section">
                    <label>标准输入 (stdin)</label>
                    <textarea id="stdin" rows="3" placeholder="例如：10 20">10 20</textarea>
                    <div style="height:12px"></div>
                    <label>输出 (stdout)</label>
                    <div class="output" id="stdout">程序输出将显示在这里...</div>
                </div>
            </aside>
        </div>
    </div>

    <!-- 折叠后恢复侧栏的悬浮按钮 -->
    <div id="sidebarToggle" title="打开侧栏"><i class="fas fa-chevron-left"></i></div>

    <script>
        /**********************************************************************
         * 简洁版脚本：功能
         * - 初始化 Monaco 编辑器
         * - 本地保存/加载代码（localStorage）
         * - 简单运行（模拟 scanf/printf）
         * - 主题切换与 UI 状态更新
         * 所有注释为中文，便于维护。
         **********************************************************************/

        // 默认代码（保持与 UI 功能一致的示例）
        const DEFAULT_CODE = `#include <stdio.h>

int main() {
    int a, b;
    // 读取两个整数并输出和
    if (scanf("%d %d", &a, &b) == 2) {
        printf("两数之和为：%d\n", a + b);
    } else {
        printf("输入格式错误\n");
    }
    return 0;
}`;

        // DOM 引用
        const runBtn = document.getElementById('runBtn');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const themeBtn = document.getElementById('themeBtn');
        const stdinEl = document.getElementById('stdin');
        const stdoutEl = document.getElementById('stdout');
        const saveStatus = document.getElementById('saveStatus');
        const closeSb = document.getElementById('closeSb');

        // Monaco 编辑器需要异步加载
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            // 尝试从 localStorage 加载之前保存的代码
            const saved = localStorage.getItem('deepseek_saved_c');
            window.editor = monaco.editor.create(document.getElementById('editor'), {
                value: saved || DEFAULT_CODE,
                language: 'c',
                theme: 'vs-light',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false
            });

            // 快捷键：Ctrl/Cmd+S 保存
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    e.preventDefault(); saveCode();
                }
            });
        });

    // ----------------- 功能函数 -----------------
        // 保存当前编辑器内容到 localStorage，并提示状态
        function saveCode() {
            if (!window.editor) return;
            localStorage.setItem('deepseek_saved_c', window.editor.getValue());
            saveStatus.textContent = '已保存';
            saveStatus.style.color = '#22c55e';
            setTimeout(() => { saveStatus.style.color = ''; }, 1200);
        }

        // 将编辑器内容重置为默认代码（不会清除 localStorage）
        function resetCode() {
            if (!window.editor) return;
            if (!confirm('确定重置代码？未保存的更改将丢失。')) return;
            window.editor.setValue(DEFAULT_CODE);
        }

        // runCode: 优先尝试 Wandbox（真实编译器），若失败尝试加载本地 WASM 运行器（若你已部署）
        // 最后回退到原有的模拟（simulateRun）。Wandbox API: https://wandbox.org
        async function tryWandboxCompile(code, stdin) {
            const wandboxUrl = 'https://wandbox.org/api/compile.json';
            const payload = {
                code,
                compiler: 'gcc-head', // 可改为 clang-head 或其他
                stdin: stdin || undefined,
                save: false
            };

            const fetchWithTimeout = (url, opts, timeout = 8000) => {
                return Promise.race([
                    fetch(url, opts),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeout))
                ]);
            };

            const resp = await fetchWithTimeout(wandboxUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 10000);

            if (!resp.ok) throw new Error('Wandbox 返回 ' + resp.status);
            const json = await resp.json();

            // Wandbox 返回字段不总是固定，常见有: program_output / program_error / compiler_output
            const out = (json.program_output || json.program_stdout || json.program || json.result || '') || '';
            const err = (json.program_error || json.program_stderr || json.compiler_error || json.compiler_output || '') || '';
            const status = json.status ?? 0;
            return { stdout: out, stderr: err, exitCode: status };
        }

        // 动态加载前端 WASM 运行器（如果你在 repo 下放置了 /wasm/tcc_runner.js）
        function loadScript(url) {
            return new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = url;
                s.onload = () => resolve();
                s.onerror = (e) => reject(new Error('加载失败: ' + url));
                document.head.appendChild(s);
            });
        }

        // 如果用户在仓库中放置了一个基于 tcc/clang 的 wasm 运行器并暴露 window.wasmRun(code, stdin)
        async function tryWasmRun(code, stdin) {
            // 常用路径：/wasm/tcc_runner.js（你需要把相应的脚本和 wasm 放到该路径）
            if (typeof window.wasmRun === 'function') {
                return await window.wasmRun(code, stdin);
            }

            // 尝试动态加载预期的脚本（如果你已上传）
            try {
                await loadScript('/wasm/tcc_runner.js');
                if (typeof window.wasmRun === 'function') {
                    return await window.wasmRun(code, stdin);
                } else {
                    throw new Error('wasmRun 未在脚本中暴露');
                }
            } catch (e) {
                throw e;
            }
        }

        async function runCode() {
            if (!window.editor) return;
            stdoutEl.textContent = '运行中（尝试 Wandbox 公共 API）...';

            const code = window.editor.getValue();
            const stdin = (stdinEl.value || '').trim();

            // 1) 先尝试 Wandbox（真实编译器）
            try {
                const res = await tryWandboxCompile(code, stdin);
                let out = '';
                if (res.stdout) out += res.stdout;
                if (res.stderr) out += '\n[stderr]\n' + res.stderr;
                out += `\n[exit code] ${res.exitCode ?? 0}`;
                stdoutEl.textContent = out.trim();
                return;
            } catch (e) {
                console.warn('Wandbox 调用失败：', e);
                stdoutEl.textContent = 'Wandbox 不可用或被阻止，尝试浏览器端 WASM（若已部署）...';
            }

            // 2) 尝试浏览器端 WASM 运行器（如果你在仓库放置了对应文件）
            try {
                const wasmRes = await tryWasmRun(code, stdin);
                // 约定 wasmRun 返回 { stdout, stderr, exitCode }
                let out = '';
                if (wasmRes.stdout) out += wasmRes.stdout;
                if (wasmRes.stderr) out += '\n[stderr]\n' + wasmRes.stderr;
                out += `\n[exit code] ${wasmRes.exitCode ?? 0}`;
                stdoutEl.textContent = out.trim();
                return;
            } catch (e) {
                console.warn('WASM 运行器不可用：', e);
                stdoutEl.textContent = '本地 WASM 运行器不可用，回退到本地模拟。';
            }

            // 3) 最后回退到简单模拟
            simulateRun(code, stdin);
        }

        // 本地回退：简单模拟 scanf/printf 行为（仅作演示）
        function simulateRun(code, input) {
            stdoutEl.textContent = '本地模拟运行...';
            setTimeout(() => {
                if (/scanf\s*\(/.test(code) && (!input || input.trim() === '')) {
                    stdoutEl.textContent = '错误：程序需要输入但未提供 stdin。';
                    return;
                }

                if (!input || input.trim() === '') {
                    stdoutEl.textContent = '提示：请在左侧输入两个整数，例如：10 20';
                    return;
                }

                const parts = input.split(/\s+/).map(s => parseInt(s, 10));
                if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) {
                    const [a, b] = parts;
                    stdoutEl.textContent = `两数之和为：${a + b}`;
                } else {
                    stdoutEl.textContent = '错误：输入格式不正确，请输入两个整数（例如：10 20）';
                }
            }, 300);
        }

        // 切换主题（轻/暗），默认暗黑
        let isDark = true;
        function toggleTheme() {
            isDark = !isDark;
            try { monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light'); } catch (e) {}
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> 明亮' : '<i class="fas fa-moon"></i> 暗色';
        }

        // ----------------- 事件绑定 -----------------
        runBtn.addEventListener('click', runCode);
        saveBtn.addEventListener('click', saveCode);
        resetBtn.addEventListener('click', resetCode);
        themeBtn.addEventListener('click', toggleTheme);

        // 侧栏折叠/展开逻辑：使用 class 'collapsed'，便于动画与恢复
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        closeSb.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
            sidebarToggle.style.display = 'flex';
        });
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            sidebarToggle.style.display = 'none';
        });

        // 全屏按钮
        const fsBtn = document.getElementById('fsBtn');
        fsBtn.addEventListener('click', () => {
            const el = document.querySelector('.frame');
            if (!document.fullscreenElement) {
                el.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        });

        // 页面卸载时自动保存（可选）
        window.addEventListener('beforeunload', () => {
            if (window.editor) localStorage.setItem('deepseek_saved_c', window.editor.getValue());
        });

        // 页面加载时：设置编辑器为暗黑主题（若 monaco 已加载则在创建时设置，若晚加载则尝试设置）
        window.addEventListener('load', () => {
            try { if (window.monaco) monaco.editor.setTheme('vs-dark'); } catch (e) {}
            // 初始时隐藏侧栏恢复按钮（默认展开）
            document.getElementById('sidebarToggle').style.display = 'none';
        });
    </script>
</body>
</html>
```

<u>现在的行为</u>
runCode() 会：
    - 尝试调用 Wandbox 公共 API，带超时与错误处理；
    - 若 Wandbox 不可用，则尝试动态加载并调用位于 /wasm/tcc_runner.js 的本地 WASM 运行器（调用约定：window.wasmRun(code, stdin) -> {stdout, stderr, exitCode}）；
    - 两者都不可用则回退到原先的 simulateRun（两数求和演示）。

**继续实现**
在Agent帮助下搭建wasm，最终push到Github的repo上
其中，还利用到了之前被我抛弃的Github Actions来进行wasm的自动化调整
完整代码不作展示，项目呈现[点击此处](https://danielhe666.github.io/projects/compiler/)

**优化调整**
11.3 21:26
1) 调整侧栏折叠的 CSS 和脚本，使编辑器在侧栏折叠后扩展填满区域并触发 Monaco 布局；
2) 为主题添加全局 CSS 变量切换与平滑过渡，并在脚本中平滑切换 Monaco 主题；
3) 在工具栏新增“打开本地文件”按钮与隐藏的 file input，并实现文件读取与确认覆盖逻辑。

11.3 21:40
1) 出现bug:侧边栏收起后再弹出被遮挡；（令人头大的css，一直在和sidebar斗智斗勇）
2) 以更为简单的输出"By ZJU C. He"作为样例代码（因为不需要编译调试了）；
3) 扩展文件类型；
4) 主题持久化;

11.4 22:02
增添CHANGELOG.MD更新日志
不再向博客中增添更新内容
[查看更新日志](https://danielhe666.github.io/projects/compiler/CHANGELOG.md)

## 小结

六年前，小学刚刚毕业的我开始第一次尝试在Github上搭建自己的个人博客。最初，我天真地以为那些网站页面背后的代码都是程序员一手敲定，所以去粗浅地学习了html和javescript的语法，然后手写了最初的`index.html`。然后，我接触到一款同样是搭建在Github Pages上的游戏“膜Siyuan“，我在Github上找到了那位大佬的repo，看光了他所有的前端，却没有办法通关游戏，那时，我认识到想要搭建一个网站是一件非常需要经验和技术的事情。

后来，通过同学的介绍认识了像Hugo、Hexo这种搭建个人博客的工具，我感到十分新奇。对照着各种社区博客照搬照抄地建了非常幼稚的博客。

渐渐的，普通的静态网页已经无法吸引我更多的兴趣，Github Pages也成为了我生成下载文件直链的工具，我不再管理我的博客。

直到现在，一个崭新的，完全改变（在我看来）Programming格局的工具诞生并迅速成熟，它完全打破了技术与非技术的边界。

从“会实现”到“会描述”，这是超越程序语言对于机器语言提升的跨越。人工智能的Agent真正意义上的实现了“代理”。我只需要向他描述我的诉求，然后构思与设计，完成一些像push这样简单的工作，我便可以实现很多我完全不了解的功能与代码。就比如Online C Compiler这个project，它源自于我在Mac上对于复杂环境配置的厌烦这一灵光乍现。然而，就是这么一个小小的spark，大模型带我走向了实现。

那么我们不禁反思，当“不可能”成为“可能”，人类的学习方式是否应该做出改变？当我们不需要再满社区地大海捞针，这些Easy Work的省略就一定会迫使人们的思维转向更高效的Solutions，由是我们又可以继续印证那句老话：

    > 人类的最大优势在于使用工具。
    