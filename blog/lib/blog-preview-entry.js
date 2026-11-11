/**
 * 博客预览渲染引擎（浏览器端打包入口）
 *
 * 输出 window.BlogMarkdown.render(src) => html
 * 渲染配置与 Hexo 站点一致（_config.yml 的 markdown 段）：
 *   html / linkify / 不换行；插件：ins、mark、sub、sup、abbr、footnote、deflist、
 *   emoji、task-lists、texmath（$...$ 与 $$...$$）、自定义容器（::: tip/info/warning/danger）。
 *
 * KaTeX 由页面额外加载 /vendor/katex/katex.min.js，这里通过 window.katex 惰性取用，
 * 因此打包体不包含 KaTeX 本身。
 *
 * 构建：npx esbuild lib/blog-preview-entry.js --bundle --minify --format=iife --outfile=source/js/vendor/blog-preview.min.js
 */
const MarkdownIt = require('markdown-it');
const ins = require('markdown-it-ins');
const mark = require('markdown-it-mark');
const sub = require('markdown-it-sub');
const sup = require('markdown-it-sup');
const abbr = require('markdown-it-abbr');
const footnote = require('markdown-it-footnote');
const deflist = require('markdown-it-deflist');
const emoji = require('markdown-it-emoji').full;
const taskLists = require('markdown-it-task-lists');
const texmath = require('markdown-it-texmath');
const containers = require('./markdown-it-containers');

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const katexShim = {
  renderToString(tex, options) {
    try {
      if (typeof window !== 'undefined' && window.katex && window.katex.renderToString) {
        return window.katex.renderToString(tex, Object.assign({ throwOnError: false, strict: false }, options));
      }
    } catch (e) {
      return '<code class="math-error">' + escapeHtml(tex) + '</code>';
    }
    return '<code>' + escapeHtml(tex) + '</code>';
  }
};

const md = new MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: false,
  linkify: true,
  typographer: false
});

md.use(ins)
  .use(mark)
  .use(sub)
  .use(sup)
  .use(abbr)
  .use(footnote)
  .use(deflist)
  .use(emoji)
  .use(taskLists);
md.use(texmath, { engine: katexShim, delimiters: 'dollars', katexOptions: { throwOnError: false } });
md.use(containers);

const api = {
  render(src) {
    try {
      return md.render(String(src == null ? '' : src));
    } catch (e) {
      return '<pre>' + escapeHtml(String(src)) + '</pre>';
    }
  }
};

if (typeof window !== 'undefined') window.BlogMarkdown = api;
module.exports = api;
