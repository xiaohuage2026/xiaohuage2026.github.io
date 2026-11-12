/* 刷新后保持滚动位置
 * 问题背景：本站文章配图等资源加载完成前，文档高度不足，
 * 浏览器默认的 history.scrollRestoration = 'auto' 恢复滚动位置时会被向上钳位，
 * 连续刷新首页时位置就会一路向上漂。
 * 修复：手动接管滚动位置的保存/恢复——
 *   1) 打开 scrollRestoration = 'manual'，阻止浏览器钳位恢复；
 *   2) 滚动时（rAF 节流）与 beforeunload 时把 window.scrollY 存入 sessionStorage；
 *   3) 恢复分两次：DOMContentLoaded 先按当前文档高度钳位恢复一次（减少顶部闪烁），
 *      window load 时（此时图片/布局已稳定）再精确恢复一次，最终位置稳定。
 * 仅在没有 URL hash 时接管（hash 锚点由浏览器自行处理）。 */
(function () {
  'use strict';
  if (location.hash) return;
  var KEY = 'scroll-pos:' + location.pathname;
  var saved = null;
  try {
    saved = sessionStorage.getItem(KEY);
  } catch (e) { /* sessionStorage 不可用时放弃恢复 */ }

  if ('scrollRestoration' in history) {
    try { history.scrollRestoration = 'manual'; } catch (e) { /* 忽略 */ }
  }

  function docMaxScroll() {
    return Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight) - (window.innerHeight || document.documentElement.clientHeight));
  }
  function restore(precise) {
    if (saved == null) return;
    var y = parseInt(saved, 10) || 0;
    if (!precise) y = Math.min(y, docMaxScroll());
    window.scrollTo(0, y);
  }
  var target = saved == null ? null : parseInt(saved, 10);
  if (target) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { restore(false); });
      window.addEventListener('load', function () { requestAnimationFrame(function () { restore(true); }); });
    } else {
      restore(false);
      window.addEventListener('load', function () { requestAnimationFrame(function () { restore(true); }); });
    }
  }

  var ticking = false;
  function persistNow() {
    try { sessionStorage.setItem(KEY, String(window.scrollY || window.pageYOffset || 0)); } catch (e) { /* 忽略 */ }
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; persistNow(); });
  }, { passive: true });
  window.addEventListener('beforeunload', persistNow);
})();

/* 自定义脚本：Banner 副标题小字（Welcome to xiaohuage2026's Blog. 下方） */
(function () {
  'use strict';
  function injectSubtitleLine() {
    var subtitle = document.getElementById('subtitle');
    if (!subtitle) return;                       // 非首页/关于页不处理
    if (document.getElementById('banner-subtitle-small')) return;  // 避免重复插入
    var small = document.createElement('div');
    small.id = 'banner-subtitle-small';
    small.className = 'banner-subtitle-small';
    small.textContent = '记录学习 · 分享生活';
    var anchor = subtitle.closest('.banner-text') || subtitle.parentNode;
    anchor.appendChild(small);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSubtitleLine);
  } else {
    injectSubtitleLine();
  }
})();
