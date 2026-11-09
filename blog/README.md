# xiaohuage2026's Blog（Hexo 源码）

本目录是博客的 **Hexo 源码**，使用 [Hexo](https://hexo.io/) + [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题。
仓库根目录下的静态 HTML 是 GitHub Pages 线上站点，由源码构建后发布。

## 环境要求

- Node.js >= 18（推荐 20+）
- npm

## 常用命令

```bash
# 安装依赖（首次 clone 后执行）
npm install

# 新建文章（生成在 source/_posts/）
npx hexo new post "文章标题"

# 新建草稿 / 页面
npx hexo new draft "草稿标题"
npx hexo new page pagename

# 本地预览（默认 http://localhost:4000）
npx hexo server

# 清理并生成静态文件到 public/
npx hexo clean && npx hexo generate
```

## 目录结构

```
blog/
├── _config.yml          # Hexo 站点配置（标题、URL、permalink、搜索等）
├── _config.fluid.yml    # Fluid 主题自定义配置（与主题默认配置合并）
├── scripts/
│   └── online-edit.js   # 「在线编辑本文」按钮注入脚本（构建期，详见下文）
├── scaffolds/           # 文章/页面模板
├── source/
│   ├── _posts/          # 文章（Markdown）
│   ├── css/custom.css   # 自定义样式（在线编辑按钮等）
│   ├── img/             # 图片资源（构建后为 /img/...）
│   ├── about/           # 关于页
│   ├── links/           # 友链页
│   ├── categories/      # 分类页
│   ├── tags/            # 标签页
│   └── 404.md           # 404 页
└── .gitignore           # 忽略 node_modules/、public/ 等
```

## 在线编辑功能

本站提供两种在线编辑方式：

1. **站内编辑器**（`/editor/`，导航栏「编辑器」）：独立的单页应用（`source/editor/index.html`，原样复制不套用主题），
   左侧 Markdown 源码、右侧实时预览，支持 KaTeX 公式、代码块、表格、任务列表、自动保存（localStorage，刷新不丢）、
   字数统计、复制 / 下载 `.md`、同步滚动，暗色模式自适应。
   下载后按 front-matter 保存为 `blog/source/_posts/xxx.md` 并提交即可发布。
   （`marked` 已本地化到 `source/js/vendor/marked.min.js`，KaTeX 走 CDN。）

2. **文章末尾「在线编辑本文」按钮**（由 `scripts/online-edit.js` 在构建期注入，`source/css/custom.css` 美化）：
   点击直达 GitHub 网页编辑器修改该文章 Markdown 源码，提交后重新构建即可更新站点。
   按钮链接中的 `GITHUB_REPO` / `GITHUB_BRANCH` / `SOURCE_PREFIX` 在 `scripts/online-edit.js` 顶部配置。

3. **管理员界面**（`/admin/`，导航栏「管理」）：通过 GitHub API 在浏览器内直接列出 / 读取 / 保存 / 新建 / 删除
   `blog/source/_posts/` 下的文章。**只有对仓库有写权限的 GitHub 账户（管理员 / 协作者）的令牌才能保存内容**；
   其他访客没有令牌，任何修改请求都会被 GitHub 拒绝。
   - 令牌建议使用 Fine-grained PAT，仅勾选本仓库的 `Contents: Read and write`；
   - 令牌仅存于 sessionStorage（关闭标签页即销毁），验证通过才会解锁编辑功能；
   - 保存即产生一次 commit；`.github/workflows/deploy.yml` 会在 `blog/**` 变更推到 main 后
     自动构建并同步到仓库根目录（GitHub Pages 发布源），约 1–2 分钟线上更新。

## 数学公式（KaTeX）

已配置 KaTeX：Markdown 渲染器换为 `hexo-renderer-markdown-it`，并启用 `markdown-it-texmath`
（`$...$` 行内、`$$...$$` 块级），Fluid 主题 `post.math.engine: katex`。KaTeX 的 CSS/字体已**本地化**
到 `source/vendor/katex/`（通过 `static_prefix.katex` 覆盖），不依赖 CDN；`\notin`、上下标、
矩阵、cases 等均可正常渲染。

> 注意：不要同时启用 `hexo-renderer-marked`，否则公式会被破坏。

## 提示容器（markdown-it-container）

`::: tip / info / warning / danger 可选标题` 语法，见 `lib/markdown-it-containers.js`
（在 `_config.yml` 的 `markdown.plugins` 中以 `./lib/markdown-it-containers.js` 加载）。
样式在 `source/css/custom.css`，暗色模式自适应。

## Mermaid 流程图

主题 `post.mermaid.enable` 已开启，且 Mermaid 8.14.0 已本地化到 `source/vendor/mermaid/mermaid.min.js`
（`static_prefix.mermaid` 覆盖）。文章中推荐使用 `{% mermaid %} ... {% endmermaid %}` 标签
（Hexo 标签插件，渲染最稳）；代码围栏写法会被行号干扰，不推荐。

## 修改说明

- 站点标题、作者、语言、URL 等：编辑 `_config.yml`
- 导航菜单、首页副标题、关于页信息、友链、页脚等：编辑 `_config.fluid.yml`
- 主题全部可用配置见 `node_modules/hexo-theme-fluid/_config.yml`（仅参考，不要直接改）

## 部署说明

本仓库即 GitHub Pages 的发布源（`username.github.io` 从 `main` 分支根目录发布）。当前部署方式为
**GitHub Actions 自动部署**（见根目录 `.github/workflows/deploy.yml`）：

1. `blog/**` 的改动推送到 `main` 后触发；
2. Action 安装依赖并执行 `npx hexo clean && npx hexo generate`；
3. 将 `blog/public/` 同步到仓库根目录（rsync --delete，排除 `.git` / `blog` / `.github`）；
4. 若有变化则机器人账号自动提交并推送，Pages 随之更新。

本地手动验证：`npm ci && npx hexo clean && npx hexo generate`，产物在 `blog/public/`。

> 注意：仓库根目录的静态文件就是线上站点——**不要手工修改根目录产物**，
> 请改 `blog/` 源码后提交，由 Action 重新生成。
