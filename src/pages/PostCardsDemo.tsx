import { useState } from 'react';
import { BasePostCard, PostType } from '@/components/post-card';
import { mockPosts } from '@/mocks/post/data';
import ImageDetailModal from '@/pages/post-details/ImageDetail';

export default function PostCardsDemo() {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleFollow = (userId: string) => {
    console.log('关注用户:', userId);
  };

  const handleLike = (postId: string) => {
    console.log('点赞帖子:', postId);
  };

  const handleUserClick = (userId: string) => {
    console.log('点击用户:', userId);
  };

  const handlePostClick = (postId: string) => {
    console.log('点击帖子:', postId);
  };

  const handleTagClick = (tag: string) => {
    console.log('点击标签:', tag);
  };

  const handleReport = (postId: string, type: 'post' | 'user') => {
    console.log('举报:', { postId, type });
  };

  const handleBlock = (postId: string, type: 'post' | 'user') => {
    console.log('屏蔽:', { postId, type });
  };

  const handleUnfollow = (userId: string) => {
    console.log('取消关注:', userId);
  };

  const handleAddComment = (postId: string, content: string) => {
    console.log('添加评论:', { postId, content });
  };

  const handleLikeComment = (commentId: string) => {
    console.log('点赞评论:', commentId);
  };

  const handleReplyComment = (commentId: string, content: string) => {
    console.log('回复评论:', { commentId, content });
  };

  const handleBlockComment = (commentId: string) => {
    console.log('屏蔽评论:', commentId);
  };

  const handleReportComment = (commentId: string) => {
    console.log('举报评论:', commentId);
  };

  const handleBlockUser = (userId: string) => {
    console.log('屏蔽用户:', userId);
  };



  // 过滤出图片类型的帖子用于演示
  const imagePosts = mockPosts.filter(post => post.type === PostType.IMAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            帖子卡片组件演示
          </h1>
          <p className="text-gray-600 mb-4">
            展示四种不同类型的帖子卡片：文章、图片、视频、动态
          </p>
          
          {/* 图片预览功能说明 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">🖼️ 图片预览功能</h2>
            <p className="text-purple-700 mb-3">
              点击图片类型的帖子中的图片，可以打开增强版预览模式，支持以下功能：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-700">
              <ul className="space-y-1">
                <li>• 🖱️ 鼠标滚轮缩放图片 (25% → 50% → 75% → 100% → 125% → 150% → 200% → 300% → 400% → 500%)</li>
                <li>• 🖱️ 拖拽移动图片（放大后）</li>
                <li>• ⚡ 双击重置图片</li>
                <li>• 🔄 工具栏：旋转90°</li>
                <li>• 📱 原图模式切换</li>
              </ul>
              <ul className="space-y-1">
                <li>• 💾 图片下载功能</li>
                <li>• ⬅️➡️ 左右箭头切换图片</li>
                <li>• 🖼️ 底部缩略图快速切换</li>
                <li>• ⌨️ 键盘快捷键：R旋转，0重置，+/-缩放</li>
                <li>• ⌨️ ESC键关闭预览</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 图片类型帖子演示 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📸 图片类型帖子（支持预览功能）</h2>
          <div className="space-y-6">
            {imagePosts.map((post) => (
              <div key={post.id} className="relative">
                <BasePostCard
                  post={post}
                  onFollow={handleFollow}
                  onLike={handleLike}
                  onUserClick={handleUserClick}
                  onPostClick={handlePostClick}
                  onTagClick={handleTagClick}
                  onReport={handleReport}
                  onBlock={handleBlock}
                  onUnfollow={handleUnfollow}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  onReplyComment={handleReplyComment}
                  onBlockComment={handleBlockComment}
                  onReportComment={handleReportComment}
                  onBlockUser={handleBlockUser}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 其他类型帖子演示 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 其他类型帖子</h2>
          <div className="space-y-6">
            {mockPosts.filter(post => post.type !== PostType.IMAGE).map((post) => (
              <div key={post.id} className="relative">
                <BasePostCard
                  post={post}
                  onFollow={handleFollow}
                  onLike={handleLike}
                  onUserClick={handleUserClick}
                  onPostClick={handlePostClick}
                  onTagClick={handleTagClick}
                  onReport={handleReport}
                  onBlock={handleBlock}
                  onUnfollow={handleUnfollow}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  onReplyComment={handleReplyComment}
                  onBlockComment={handleBlockComment}
                  onReportComment={handleReportComment}
                  onBlockUser={handleBlockUser}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>组件结构：</strong>每个帖子卡片都由公共组件（头部、标签、底部）和特定类型的内容组件组成。
            </p>
            <p>
              <strong>类型支持：</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><span className="font-medium text-purple-600">文章类型：</span>显示文章标题、内容摘要和全文字数</li>
              <li><span className="font-medium text-green-600">图片类型：</span>支持单图显示和多图轮播，<strong>点击图片可打开增强预览模式</strong></li>
              <li><span className="font-medium text-purple-600">视频类型：</span>显示视频封面、时长和播放控制</li>
              <li><span className="font-medium text-purple-600">动态类型：</span>支持文字内容和九宫格图片布局</li>
            </ul>
            <p>
              <strong>交互功能：</strong>所有类型都支持点赞、评论、关注、分享等完整的社交功能。
            </p>
            <p>
              <strong>图片预览：</strong>图片类型帖子支持类似微博的图片预览功能，包括缩放、旋转、拖拽等操作。
            </p>
          </div>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {showImageModal && selectedPost && (
        <ImageDetailModal
          post={selectedPost}
          initialIndex={selectedIndex}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
} 