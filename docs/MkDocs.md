# MkDocs
## 安装MkDocs
```
pip install mkdocs
```
## 入门
```
mkdocs new my-project
cd my-project
```
有一个名为mkdocs.yml的配置文件，以及一个名为docs的文件夹，它将包含你的文档源文件。现在docs文件夹只包含一个名为index.md的文档页面。

MkDocs附带一个内置的开发服务器，可以让你在处理文档时预览文档。 确保与mkdocs.yml配置文件位于同一目录中，然后通过运行mkdocs serve命令启动服务器：
```
$ mkdocs serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
[I 160402 15:50:43 server:271] Serving on http://127.0.0.1:8000
[I 160402 15:50:43 handlers:58] Start watching changes
[I 160402 15:50:43 handlers:60] Start detecting changes
```
在浏览器中打开`http://127.0.0.1:8000`，你将看到你的默认主页
![默认主页](https://www.tsingdao.net/mkdocs-docs-zh/img/screenshot.png)

开发服务器还支持自动重新加载，并且只要配置文件、文档目录或主题目录中的任何内容发生更改，都将重新生成文档。

使用你的文本编辑器打开`docs/index.md`文档，将初始标题更改为“MkLorum”，然后保存更改。浏览器将自动重新加载，你将立即看到更新过的文档。

现在尝试编辑配置文件：`mkdocs.yml`。 将`site_name`设置更改为“MkLorum”并保存文件。

你的浏览器应立即重新加载，你将看到新设置的站点名称已经生效。

![站点名称生效](https://www.tsingdao.net/mkdocs-docs-zh/img/site-name.png)

## 添加页面
现在在文档中添加第二个页面：
```
curl 'https://jaspervdj.be/lorem-markdownum/markdown.txt' > docs/about.md
```
由于我们的文档站点将包含一些导航，你可以编辑配置文件，并通过添加`nav`设置来管理每个页面导航的顺序、标题和嵌套情况：
```
site_name: MkLorum
nav:
    - Home: index.md
    - About: about.md
```
保存更改，你将看到左侧有“Home”和“About”导航栏，同时右侧还有“Search”，“Previous”和“Next”。
![导航栏](https://www.tsingdao.net/mkdocs-docs-zh/img/multipage.png)
尝试菜单项并在页面之间来回导航。 然后单击`Search`。 将出现一个搜索对话框，允许你搜索任何页面上的任何文本。 请注意，搜索结果包括网站上每次出现的搜索字词，并直接链接到搜索字词所在页面的部分。你无需付出任何努力或配置即可获得所有这些！
![Search](https://www.tsingdao.net/mkdocs-docs-zh/img/search.png)

## 主题化我们的文档
现在，更改配置文件以通过更改主题来更改文档的显示方式。 编辑`mkdocs.yml`文件并添加`theme`设置：
```
site_name: MkLorum
nav:
    - Home: index.md
    - About: about.md
theme: readthedocs
```
保存更改，你将看到改为使用了ReadTheDocs主题。
![Readthedocs主题](https://www.tsingdao.net/mkdocs-docs-zh/img/readthedocs.png)

## 更改Favicon图标
默认情况下，MkDocs使用MkDocs favicon图标。 要使用不同的图标，请在`docs_dir`中创建一个`img`子目录，并将自定义的`favicon.ico`文件复制到该目录。 MkDocs将自动检测并使用该文件作为你的favicon图标。
## 生成网站
那看起来不错。 你已准备好部署`MkLorum`文档。 首先生成文档：
```
mkdocs build
```
这将创建一个名为`site`的新目录。 看一下该目录的情况：
```
$ ls site
```
```
about  fonts  index.html  license  search.html
css    img    js          mkdocs   sitemap.xml
```
请注意，你的源文档已输出为两个名为`index.html`和`about/index.html`的HTML文件。同时各种其他媒体文件也已被复制到site目录中作为文档主题的一部分。另外还有一个`sitemap.xml`文件和`mkdocs/search_index.json`。
如果你正在使用版本控制软件，例如`git`，你可能不希望将生成的文件包含到存储库中。只需要在`.gitignore`文件中添加一行`site/`即可。
```
echo "site/" >> .gitignore
```
如果你正在使用其他版本控制工具，请你自行查阅相关文档，了解如何忽略特定目录。

一段时间后，文件可能会从文档中删除，但它们仍将驻留在`site`目录中。 要删除那些陈旧的文件，只需在运行`mkdocs`命令时带上`--clean`参数即可。
```
mkdocs build --clean
```
## 其他命令和选项
还有其他各种命令和选项。有关命令的完整列表，请使用`--help`标志：
```
mkdocs --help
```
要查看给定命令上可用的选项列表，请使用带有该命令的`--help`标志。 例如，要获取`build`命令可用的所有选项的列表，请运行以下命令：
```
mkdocs build --help
```