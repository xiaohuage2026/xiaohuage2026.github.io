/**
 * markdown-it 容器插件（markdown-it-container 封装）
 *
 * 支持语法：
 *   ::: tip 可选标题 ... :::
 *   ::: info / ::: warning / ::: danger
 *
 * 在 Hexo 配置中通过 `markdown.plugins` 以 `{ name: './lib/markdown-it-containers.js' }` 方式加载
 * （渲染器会以站点根目录为 paths 做 require.resolve）。
 */
const container = require('markdown-it-container');

const TYPES = [
  { name: 'tip', title: '提示' },
  { name: 'info', title: '信息' },
  { name: 'warning', title: '注意' },
  { name: 'danger', title: '警告' },
];

module.exports = function containersPlugin(md) {
  for (const { name, title } of TYPES) {
    md.use(container, name, {
      validate(params) {
        return params.trim().split(/\s+/, 1)[0] === name;
      },
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          const custom = token.info.trim().slice(name.length).trim();
          return `<div class="custom-block custom-block-${name}"><p class="custom-block-title">${md.utils.escapeHtml(custom || title)}</p>\n`;
        }
        return '</div>\n';
      },
    });
  }
};
