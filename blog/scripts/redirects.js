/**
 * 旧地址 → 新地址 静态跳转页生成器
 *
 * 读取 source/_data/redirects.yml（每条 - { from: "/旧地址/", to: "/新地址/" }），
 * 为每条记录输出 from/index.html，内容为 meta refresh + canonical + JS location.replace，
 * 作为 GitHub Pages（无服务器端 301）上「文章改名后旧链接自动跳转」的实现。
 *
 * 仅在跳转表非空时输出；表为空则本生成器不产生任何页面。
 */
'use strict';

function normalizePath(p) {
  var s = String(p == null ? '' : p).trim();
  if (!s) return '';
  s = s.replace(/\\/g, '/');                 // 反斜杠统一按正斜杠解析（浏览器亦如此），消除 /\evil.com 类绕过
  if (/[\x00-\x1f\x7f]/.test(s)) return '';   // 控制字符直接拒绝
  s = s.split('#')[0].split('?')[0];          // 去掉 hash / query
  s = s.replace(/^\/+/, '/');                  // 折叠开头连续斜杠，消除 //evil.com 协议相对跳转
  if (s.charAt(0) !== '/') s = '/' + s;
  if (!s.endsWith('/')) s += '/';
  if (!/^\/(?!\/)/.test(s)) return '';         // 双保险：必须单斜杠开头
  return s;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stub(from, to) {
  return '<!DOCTYPE html>\n' +
'<html lang="zh-CN">\n' +
'<head>\n' +
'  <meta charset="utf-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'  <meta http-equiv="refresh" content="0; url=' + escapeHtml(to) + '">\n' +
'  <link rel="canonical" href="' + escapeHtml(to) + '">\n' +
'  <title>页面已迁移 · xiaohuage2026&#39;s Blog</title>\n' +
'  <script>location.replace(' + JSON.stringify(to) + ');</script>\n' +
'</head>\n' +
'<body>\n' +
'  <p>本页已迁移至新地址：<a href="' + escapeHtml(to) + '">' + escapeHtml(to) + '</a></p>\n' +
'</body>\n' +
'</html>\n';
}

hexo.extend.generator.register('redirects', function () {
  var data = hexo.locals.get('data') || {};
  var list = data.redirects;
  if (!Array.isArray(list)) list = [];
  var out = [];
  var seen = {};
  for (var i = 0; i < list.length; i++) {
    var item = list[i] || {};
    var from = normalizePath(item.from);
    var to = normalizePath(item.to);
    if (!from || !to || from === to) continue;
    if (!/^\/(?!\/)/.test(to)) {               // 理论不可达（normalizePath 已保证）
      hexo.log.warn('[redirects] 跳过非法跳转目标（必须为站内绝对路径）: ' + to);
      continue;
    }
    if (seen[from]) continue;                 // 同一个旧地址只生成一次
    seen[from] = true;
    out.push({ path: from.replace(/^\/+/, '') + 'index.html', data: stub(from, to) });
  }
  return out;
});
