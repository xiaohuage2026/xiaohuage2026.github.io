/**
 * 构建期文章消毒（after_post_render）
 *
 * 背景：Hexo 的 markdown 渲染开启了 `html: true`（允许在文章中写 raw HTML，
 * 如 <kbd> <details>），若恶意 HTML 进入文章，访客浏览器会直接执行。
 * 本过滤器在文章 HTML 生成之后、注入页面布局之前，按白名单过滤：
 *   - 保留本站渲染产物：kaitex（MathML + katex-html）、highlight.js figure/table/span、
 *     任务列表 <input>、脚注、自定义容器、kbd/details/abbr/ins/mark 等；
 *   - 清除：<script>/<iframe>/事件处理属性（onerror 等）/javascript: 链接；
 *   - 链接协议仅允许 http/https/mailto/相对路径，图片额外允许 data:。
 *
 * 仅处理有内容的 post / page；布局脚本、主题静态资源不经过此过滤器。
 */
'use strict';

const sanitizeHtml = require('sanitize-html');

const mathMlTags = [
  'math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'msubsup',
  'mfrac', 'msqrt', 'mroot', 'mtext', 'mspace', 'mtable', 'mtr', 'mtd', 'mover', 'munder',
  'munderover', 'mpadded', 'mstyle', 'mphantom', 'menclose', 'mmultiscripts', 'mprescripts',
  'none', 'maligngroup', 'malignmark'
];

const OPTIONS = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'mark', 'kbd', 'code', 'pre', 'sub', 'sup',
    'small', 'abbr', 'q', 'cite',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    'caption', 'colgroup', 'col',
    'a', 'img', 'figure', 'figcaption',
    'details', 'summary', 'blockquote', 'input',
    ...mathMlTags
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'aria-hidden', 'aria-label', 'role'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    span: ['class', 'style'],
    div: ['class', 'style'],
    td: ['style'],
    th: ['style'],
    code: ['class'],
    pre: ['class'],
    input: ['type', 'checked', 'disabled'],
    abbr: ['title'],
    ol: ['start'],
    annotation: ['encoding'],
    math: ['xmlns', 'display'],
    section: ['class'],
    li: ['class'],
    figure: ['class'],
    col: ['span', 'style']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  disallowedTagsMode: 'discard'
};

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || !data.content) return data;
  data.content = sanitizeHtml(data.content, OPTIONS);
  return data;
});
