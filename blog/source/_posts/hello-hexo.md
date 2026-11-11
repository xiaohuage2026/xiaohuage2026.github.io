---
title: 你好，Hexo！
date: 2026-11-09 08:00:00
updated: 2026-11-09 08:00:00
categories:
  - 随笔
tags:
  - Hexo
  - Fluid
  - 博客
---

欢迎来到 **xiaohuage2026's Blog**！🎉

这是本站使用 [Hexo](https://hexo.io/) + [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题生成的第一篇文章。本文既是欢迎页，也是一份 **Markdown 渲染能力速览**：常用语法全部真实渲染，同时保留了一部分「目前不支持」的写法，方便日后逐步修复。

<!-- more -->

## 关于本站

- 生成器：Hexo 8
- 主题：hexo-theme-fluid 1.9.9
- Markdown 渲染：markdown-it（hexo-renderer-markdown-it）+ KaTeX 公式 + Mermaid 流程图 + 提示容器
- 部署：GitHub Pages
- 源码位置：本仓库的 `blog/` 目录
- 编辑入口：导航栏「编辑器」（`/editor/`，可在线写作 + 预览 + 下载 / 复制），管理员登录后可直接提交到仓库

## 常用命令

```bash
# 创建一篇新文章
npx hexo new post "文章标题"

# 创建一个新页面
npx hexo new page pagename

# 本地预览（http://localhost:4000）
npx hexo server

# 生成静态文件到 public/
npx hexo clean && npx hexo generate
```

## 标题

本页正文从 `##` 开始（`#` 与文章标题重复，不推荐在正文使用）：

### 三级标题

#### 四级标题

## 文字样式

- **粗体** 与 *斜体* 与 ***粗斜体*** 与 ~~删除线~~
- ==高亮文字（markdown-it-mark）==
- ++下划线插入（markdown-it-ins）++
- 下标 H~2~O、上标 x^2^（markdown-it-sub / markdown-it-sup）
- `行内代码`（inline code）
- 中英混排 *italic 中文混排 italic* 测试

## 列表

### 无序列表（含嵌套）

- 一级
  - 二级
    - 三级
- 一级 B

### 有序列表

1. 第一步
2. 第二步
   1. 第二步的子项
   2. 再一个子项
3. 第三步

### 任务列表（GFM）

- [x] 安装 Hexo
- [x] 应用 Fluid 主题
- [x] 引入 KaTeX 数学公式
- [ ] 写第一百篇文章
- [ ] 拿到 GitHub 小绿点

## 定义列表（markdown-it-deflist）

Hexo
:   一款快速、简洁且高效的博客框架，基于 Node.js。

Fluid
:   一款 Material Design 风格的 Hexo 主题。

## 引用

> Markdown 是一种轻量级标记语言。
>
> 它可以让你使用易读易写的纯文本格式编写文档。

嵌套引用：

> 外层引用
>
> > 内层嵌套引用
> >
> > 还可以嵌套 `行内代码` 甚至代码块：
> >
> > ```python
> > def greet(name):
> >     return f"Hello, {name}!"
> > ```

## 代码块

未指定语言，fallback 渲染：

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```

指定 `python`：

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + mid + quicksort(right)
```

指定 `bash`：

```bash
npm install hexo-theme-fluid
npx hexo clean && npx hexo generate
```

## 表格

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| Hexo   |   8.1.2 |      1 |
| Fluid  |  1.9.9  |      2 |
| KaTeX  |  0.16.x |      3 |

## 链接

行内式：[Hexo 官网](https://hexo.io/)

带标题（悬停可见）：[Fluid 主题](https://github.com/fluid-dev/hexo-theme-fluid "Fluid 主题仓库")

引用式：[Hexo 文档][hexo-docs]

自动链接：<https://github.com/xiaohuage2026/xiaohuage2026.github.io>

[hexo-docs]: https://hexo.io/zh-cn/docs/ "Hexo 中文文档"

## 图片

![Fluid 头图](/img/default.png "Fluid 默认 Banner")

## 分割线

上半部分

---

下半部分

## 脚注

这里有一个脚注引用[^1]，还有一个长脚注[^long]。

[^1]: 这是脚注内容。

[^long]: 这是一个比较长的脚注，可以包含 `代码`、**粗体**，甚至跨行。

    缩进四格就能换段。

## 缩写（markdown-it-abbr）

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets
*[KaTeX]: 基于 TeX 的数学公式渲染库

HTML 与 CSS 的缩写会在鼠标悬停时显示全称，KaTeX 也是。

## Emoji（markdown-it-emoji）

:smile: :tada: :rocket: :+1: :books:

## 数学公式（KaTeX）

行内公式：质能方程 $E = mc^2$，欧拉公式 $e^{i\pi} + 1 = 0$。

行间公式：

$$
H_n = \sum_{i=1}^{n} \frac{1}{i}
$$

分数与根号：

$$
\frac{1}{1 + \frac{1}{2}}, \qquad \sqrt{1 + \sqrt[p]{1 + a^2}}
$$

矩阵（`pmatrix` / `bmatrix`）：

$$
\begin{pmatrix}
  1 & 8 & 4 \\
  7 & 9 & 2 \\
\end{pmatrix}
\qquad
\begin{bmatrix}
  1 & 2 \\
  3 & 4 \\
\end{bmatrix}
$$

分段函数（`cases`）：

$$
f(x) =
\begin{cases}
  2 & x \in \mathbb{Q} \\
  1 & x \notin \mathbb{Q} \land x \in \mathbb{A} \\
  0 & x \notin \mathbb{A}
\end{cases}
$$

多行对齐（`aligned`）：

$$
\begin{aligned}
  \cos(2\theta) &= \cos^2(\theta) - \sin^2(\theta) \\
                &= 2\cos^2(\theta) - 1 \\
                &= 1 - 2\sin^2(\theta)
\end{aligned}
$$

积分（`\displaystyle`）：

$$
\displaystyle \int_0^x f(t) \, \mathrm{d} t
$$

## 内嵌 HTML

<kbd>Ctrl</kbd> + <kbd>C</kbd> 复制，<kbd>Ctrl</kbd> + <kbd>V</kbd> 粘贴。

<details>
<summary>点击展开：折叠区块（HTML details 标签）</summary>

折叠内容里可以写 **Markdown**，也可以写公式 $a^2 + b^2 = c^2$。

```cpp
// 折叠区块里的代码块
std::cout << "hello" << std::endl;
```

</details>

## 提示容器（markdown-it-container）

支持四种类型：`tip` / `info` / `warning` / `danger`，语法为 `::: 类型 可选标题`，以 `:::` 结尾：

::: tip 这是一个提示
容器里可以写 **Markdown**，也可以写公式：$a^2 + b^2 = c^2$。
:::

::: info
不写标题时使用默认标题。info 适合陈述客观信息。
:::

::: warning 注意
warning 适合需要提醒读者的内容。
:::

::: danger 危险操作
danger 适合警告，例如 `rm -rf /` 之类的操作。
:::

## Mermaid 流程图

站内已启用 Mermaid，推荐使用 `{% mermaid %}` 标签（渲染最稳）：

{% mermaid %}
graph LR
  A[写 Markdown] --> B{hexo generate}
  B -->|成功| C[部署到 GitHub Pages]
  B -->|报错| D[检查 front-matter / 语法]
  D --> A
{% endmermaid %}

时序图也可以：

{% mermaid %}
sequenceDiagram
  participant 你
  participant 博客
  participant GitHub
  你->>博客: hexo new post "标题"
  博客-->>你: source/_posts/xxx.md
  你->>GitHub: git push
  GitHub-->>GitHub: 构建并发布 Pages
{% endmermaid %}


## 🚧 目前不支持 / 待完善的语法

以下写法目前**不会按预期渲染**，留作日后改进（届时删掉对应小节即可）：

### 1. `[TOC]` 目录占位符

[TOC]

### 2. 代码行高亮语法 ```` ```cpp{1,3} ````

```cpp{1,3}
// 期望高亮第 1 行和第 3 行，目前不支持，会当作普通代码块
#include <bits/stdc++.h>
using namespace std;
int main() { return 0; }
```

### 3. Mermaid 代码围栏（请使用 `{% mermaid %}` 标签代替）

````text
```mermaid
graph LR
  A[写博客] --> B[hexo generate] --> C[部署]
```
````

启用行号的代码块会破坏 Mermaid 源码，因此围栏写法渲染结果不可控；请统一使用上文 `{% mermaid %}` 标签。

### 4. 未注册的标签插件（如 `{% youtube %}`）

Fluid 内置标签：`note` / `button` / `checkbox` / `fold` / `label` / `mermaid` / `group-image`（均可正常使用）。但使用**未注册**的标签（例如 youtube 视频嵌入）会导致构建直接报错中止，因此这类写法应当避免。

## 写作计划

这里将持续更新学习笔记、技术文章与生活随笔，欢迎常来看看

本文已被管理员编辑
