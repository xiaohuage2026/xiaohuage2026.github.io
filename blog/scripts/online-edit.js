/**
 * 在线编辑功能
 *
 * 构建期为每篇文章（_posts 下的页面）在正文末尾注入一个「在线编辑本文」按钮，
 * 点击后跳转到站内 /editor/ 页面并带上 ?file=<源码路径> 参数：
 *   - 普通访客：进入博客内 Markdown 编辑器（实时预览、下载 / 复制）；
 *   - 管理员：在编辑器中输入管理员密码解锁（与 /admin/ 共用本地加密保险箱），
 *     解锁后会自动载入该文章源码，编辑完成后可一键提交到 GitHub 仓库（直接触发自动部署）。
 *
 * 源码路径 = 仓库内 blog/source/ 下的相对路径（即 post.source，如 _posts/xxx.md）。
 */

hexo.extend.filter.register('after_post_render', function (post) {
  // 只处理文章（source/_posts 下的内容），跳过页面和草稿
  if (!post.source || !post.source.startsWith('_posts/')) return post;

  const sourcePath = post.source.replace(/\\/g, '/'); // 如 _posts/2026-11-09-hello-hexo.md
  const editUrl = `/editor/?file=${encodeURIComponent(sourcePath)}`;

  const html = `
<div class="online-edit">
  <a class="online-edit__btn" href="${editUrl}" title="在博客编辑器中打开此文（管理员登录后可直接提交到仓库）">
    <span class="online-edit__icon">✏️</span>
    <span>在线编辑本文</span>
  </a>
  <span class="online-edit__tip">管理员解锁后保存即提交到仓库，自动构建上线</span>
</div>`;

  post.content += html;
  return post;
});
