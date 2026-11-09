/**
 * 在线编辑功能
 *
 * 构建期为每篇文章（_posts 下的页面）在正文末尾注入一个「在线编辑本文」按钮，
 * 点击后跳转到 GitHub 网页编辑器，直接编辑该文章的 Markdown 源码并提交到仓库。
 * （GitHub Pages 是纯静态托管，没有后端，这是不依赖后端的在线编辑方案。）
 *
 * 如仓库名/分支变化，修改下面两个常量即可。
 */
const GITHUB_REPO = 'xiaohuage2026/xiaohuage2026.github.io';
const GITHUB_BRANCH = 'main';
const SOURCE_PREFIX = 'blog/source'; // 源码在仓库中的路径前缀

hexo.extend.filter.register('after_post_render', function (post) {
  // 只处理文章（source/_posts 下的内容），跳过页面和草稿
  if (!post.source || !post.source.startsWith('_posts/')) return post;

  const sourcePath = `${SOURCE_PREFIX}/${post.source}`.replace(/\\/g, '/');
  const editUrl = `https://github.com/${GITHUB_REPO}/edit/${GITHUB_BRANCH}/${encodeURI(sourcePath)}`;

  const html = `
<div class="online-edit">
  <a class="online-edit__btn" href="${editUrl}" target="_blank" rel="noopener" title="在 GitHub 网页编辑器中编辑此文源码">
    <i class="iconfont icon-github-fill online-edit__icon"></i>
    <span>在线编辑本文</span>
  </a>
  <span class="online-edit__tip">修改将通过 GitHub 提交到 ${GITHUB_BRANCH} 分支</span>
</div>`;

  post.content += html;
  return post;
});
