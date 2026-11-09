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
