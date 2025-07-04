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

  // 根据类型获取类型标签颜色
  const getTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.ARTICLE:
        return 'bg-blue-100 text-blue-800';
      case PostType.IMAGE:
        return 'bg-green-100 text-green-800';
      case PostType.VIDEO:
        return 'bg-purple-100 text-purple-800';
      case PostType.DYNAMIC:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型显示名称
  const getTypeName = (type: PostType) => {
    switch (type) {
      case PostType.ARTICLE:
        return '文章';
      case PostType.IMAGE:
        return '图片';
      case PostType.VIDEO:
        return '视频';
      case PostType.DYNAMIC:
        return '动态';
      default:
        return '未知';
    }
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

        {/* 类型概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.values(PostType).map(type => (
            <div key={type} className="bg-white rounded-lg p-4 text-center shadow-sm border">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getTypeColor(type)}`}>
                {getTypeName(type)}
              </div>
              <p className="text-xs text-gray-500">
                {type === PostType.ARTICLE && '支持全文字数显示'}
                {type === PostType.IMAGE && '支持多图轮播'}
                {type === PostType.VIDEO && '支持视频播放'}
                {type === PostType.DYNAMIC && '支持九宫格图片'}
              </p>
            </div>
          ))}
        </div>

        {/* 帖子卡片列表 */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <div key={post.id} className="relative">
              {/* 类型标签 */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getTypeColor(post.type)}`}>
                  {getTypeName(post.type)}
                </div>
              </div>
              
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