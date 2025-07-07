import React, { useState } from 'react';
import PostHeader from './PostHeader';
import PostTags from './PostTags';
import PostFooter from './PostFooter';
import { ArticleContent, ImageContent, VideoContent, DynamicContent } from './content';
import { PostType, type PostItem, type PostCardProps } from './post.types';

export default function BasePostCard(props: PostCardProps) {
  const { 
    post, 
    onFollow, 
    onLike, 
    onUserClick, 
    onPostClick, 
    onTagClick, 
    onReport, 
    onBlock, 
    onUnfollow, 
    onAddComment, 
    onLikeComment, 
    onReplyComment,
    onBlockComment,
    onReportComment,
    onBlockUser,
    onHeightChange
  } = props;

  const [isTransitioning, setIsTransitioning] = useState(false);

  // 处理高度变化时的动画状态
  const handleHeightChangeWithAnimation = () => {
    setIsTransitioning(true);
    onHeightChange?.();
    
    // 动画结束后清除transitioning状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // 根据帖子类型渲染不同的内容组件
  const renderPostContent = () => {
    switch (post.type) {
      case PostType.ARTICLE:
        return <ArticleContent post={post} onPostClick={onPostClick} />;
      case PostType.IMAGE:
        return <ImageContent post={post} onPostClick={onPostClick} />;
      case PostType.VIDEO:
        return <VideoContent post={post} onPostClick={onPostClick} />;
      case PostType.DYNAMIC:
        return <DynamicContent post={post} onPostClick={onPostClick} />;
      default:
        // 默认以文章形式显示
        return <ArticleContent post={post as any} onPostClick={onPostClick} />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 ${
      isTransitioning ? 'post-height-transitioning' : ''
    }`}>
      {/* 头部：用户信息和关注按钮 */}
      <PostHeader
        post={post}
        onFollow={onFollow}
        onUserClick={onUserClick}
        onReport={onReport}
        onBlock={onBlock}
        onUnfollow={onUnfollow}
      />

      {/* 根据类型渲染不同的内容 */}
      {renderPostContent()}

      {/* 标签 */}
      <PostTags
        tags={post.tags}
        onTagClick={onTagClick}
      />

      {/* 底部交互按钮和评论区 */}
      <PostFooter
        post={post}
        onLike={onLike}
        onAddComment={onAddComment}
        onLikeComment={onLikeComment}
        onReplyComment={onReplyComment}
        onUserClick={onUserClick}
        onBlockComment={onBlockComment}
        onReportComment={onReportComment}
        onBlockUser={onBlockUser}
        onHeightChange={handleHeightChangeWithAnimation}
      />
    </div>
  );
}
