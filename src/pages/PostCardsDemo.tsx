import React from 'react';
import { BasePostCard, PostType } from '@/components/post-card';
import { mockPosts } from '@/mocks/post/data';

export default function PostCardsDemo() {
  const handleFollow = (userId: string) => {
    console.log('关注用户:', userId);
  };

  const handleLike = (postId: number) => {
    console.log('点赞帖子:', postId);
  };

  const handleUserClick = (userId: string) => {
    console.log('点击用户:', userId);
  };

  const handlePostClick = (postId: number) => {
    console.log('点击帖子:', postId);
  };

  const handleTagClick = (tag: string) => {
    console.log('点击标签:', tag);
  };

  const handleReport = (postId: number, type: 'post' | 'user') => {
    console.log('举报:', { postId, type });
  };

  const handleBlock = (postId: number, type: 'post' | 'user') => {
    console.log('屏蔽:', { postId, type });
  };

  const handleUnfollow = (userId: string) => {
    console.log('取消关注:', userId);
  };

  const handleAddComment = (postId: number, content: string) => {
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



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            帖子卡片组件演示
          </h1>
          <p className="text-gray-600">
            展示四种不同类型的帖子卡片：文章、图片、视频、动态
          </p>
        </div>



        {/* 帖子卡片列表 */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <div key={post.id} className="relative">
              {/* 帖子卡片 */}
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
              <li><span className="font-medium text-blue-600">文章类型：</span>显示文章标题、内容摘要和全文字数</li>
              <li><span className="font-medium text-green-600">图片类型：</span>支持单图显示和多图轮播</li>
              <li><span className="font-medium text-purple-600">视频类型：</span>显示视频封面、时长和播放控制</li>
              <li><span className="font-medium text-orange-600">动态类型：</span>支持文字内容和九宫格图片布局</li>
            </ul>
            <p>
              <strong>交互功能：</strong>所有类型都支持点赞、评论、关注、分享等完整的社交功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 