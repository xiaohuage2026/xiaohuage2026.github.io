/* global CONFIG */

/**
 * 本站补丁版 Fluid local-search.js（来源 hexo-theme-fluid 1.9.9，MIT）
 * 相对原版修复：
 *  1. 搜索关键词先 escapeRegExp 再进 new RegExp —— 修复 `[` 等输入导致整个输入处理器抛异常，
 *     以及 (a+)+$ 型指数回溯 ReDoS 卡死主线程；
 *  2. 结果里的文章标题、URL 一律 escHtml 后再拼接进 innerHTML —— 修复文章标题/文件名含 HTML 时的注入；
 *  3. 正文节选内容 escHtml 后再高亮关键词（关键词同样先 escHtml + escapeRegExp）—— 防止 CDATA 中的 HTML 原样注入。
 * 其余逻辑与原版一致。
 */
(function() {
  // --- 安全补丁 ---
  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function safeUrl(u) {
    var s = String(u || '');
    return /^(\/|https?:\/\/)/i.test(s) ? s : '#';
  }

  // Modified from [hexo-generator-search](https://github.com/wzpan/hexo-generator-search)
  function localSearchFunc(path, searchSelector, resultSelector) {
    'use strict';
    // 0x00. environment initialization
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the resultSelector');
    }

    if ($result.attr('class').indexOf('list-group-item') === -1) {
      $result.html('<div class="m-auto text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div><br/>Loading...</div>');
    }

    jQuery.ajax({
      // 0x01. load xml file
      url     : path,
      dataType: 'xml',
      success : function(xmlResponse) {
        // 0x02. parse xml file
        var dataList = jQuery('entry', xmlResponse).map(function() {
          return {
            title  : jQuery('title', this).text(),
            content: jQuery('content', this).text(),
            url    : jQuery('url', this).text()
          };
        }).get();

        if ($result.html().indexOf('list-group-item') === -1) {
          $result.html('');
        }

        $input.on('input', function() {
          // 0x03. parse query to keywords list
          var content = $input.val();
          var resultHTML = '';
          var keywords = content.trim().toLowerCase().split(/[\s-]+/);
          $result.html('');
          if (content.trim().length <= 0) {
            return $input.removeClass('invalid').removeClass('valid');
          }
          // 0x04. perform local searching
          dataList.forEach(function(data) {
            var isMatch = true;
            if (!data.title || data.title.trim() === '') {
              data.title = 'Untitled';
            }
            var orig_data_title = data.title.trim();
            var data_title = orig_data_title.toLowerCase();
            var orig_data_content = data.content.trim().replace(/<[^>]+>/g, '');
            var data_content = orig_data_content.toLowerCase();
            var data_url = data.url;
            var index_title = -1;
            var index_content = -1;
            var first_occur = -1;
            // Skip matching when content is included in search and content is empty
            if (CONFIG.include_content_in_search && data_content === '') {
              isMatch = false;
            } else {
              keywords.forEach(function (keyword, i) {
                index_title = data_title.indexOf(keyword);
                index_content = data_content.indexOf(keyword);

                if (index_title < 0 && index_content < 0) {
                  isMatch = false;
                } else {
                  if (index_content < 0) {
                    index_content = 0;
                  }
                  if (i === 0) {
                    first_occur = index_content;
                  }
                }
              });
            }
            // 0x05. show search results
            if (isMatch) {
              resultHTML += '<a href=\'' + escHtml(safeUrl(data_url)) + '\' class=\'list-group-item list-group-item-action font-weight-bolder search-list-title\' rel="noopener">' + escHtml(orig_data_title) + '</a>';
              var content = orig_data_content;
              if (first_occur >= 0) {
                // cut out 100 characters
                var start = first_occur - 20;
                var end = first_occur + 80;

                if (start < 0) {
                  start = 0;
                }

                if (start === 0) {
                  end = 100;
                }

                if (end > content.length) {
                  end = content.length;
                }

                var match_content = escHtml(content.substring(start, end));

                // highlight all keywords（关键词先转义，避免 ReDoS 与 HTML 注入）
                keywords.forEach(function(keyword) {
                  var regS = new RegExp(escRegExp(escHtml(keyword)), 'gi');
                  match_content = match_content.replace(regS, '<span class="search-word">$&</span>');
                });

                resultHTML += '<p class=\'search-list-content\'>' + match_content + '...</p>';
              }
            }
          });
          if (resultHTML.indexOf('list-group-item') === -1) {
            return $input.addClass('invalid').removeClass('valid');
          }
          $input.addClass('valid').removeClass('invalid');
          $result.html(resultHTML);
        });
      }
    });
  }

  function localSearchReset(searchSelector, resultSelector) {
    'use strict';
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the resultSelector');
    }

    $input.val('').removeClass('invalid').removeClass('valid');
    $result.html('');
  }

  var modal = jQuery('#modalSearch');
  var searchSelector = '#local-search-input';
  var resultSelector = '#local-search-result';
  modal.on('show.bs.modal', function() {
    var path = CONFIG.search_path || '/local-search.xml';
    localSearchFunc(path, searchSelector, resultSelector);
  });
  modal.on('shown.bs.modal', function() {
    jQuery('#local-search-input').focus();
  });
  modal.on('hidden.bs.modal', function() {
    localSearchReset(searchSelector, resultSelector);
  });
})();
