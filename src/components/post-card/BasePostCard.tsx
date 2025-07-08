import React from 'react';
import { ArticleContent, DynamicContent, ImageContent, VideoContent } from './content';
import { PostType, type PostCardProps } from './post.types';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import PostTags from './PostTags';

export default function BasePostCard(props: PostCardProps) {
  const { post } = props;

  // 根据帖子类型渲染不同的内容组件
  const renderPostContent = () => {
    switch (post.type) {
      case PostType.ARTICLE:
        return <ArticleContent post={post} />;
      case PostType.IMAGE:
        return <ImageContent post={post} />;
      case PostType.VIDEO:
        return <VideoContent post={post} />;
      case PostType.DYNAMIC:
        return <DynamicContent post={post} />;
      default:
        // 默认以文章形式显示
        return <ArticleContent post={post} />;
    }
  };

  return (
    <div className={`bg-white border border-gray-100 p-4 flex gap-2`}>
      {/* 头部：用户信息和关注按钮 */}
      {/* 用户头像 */}
      <div
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
        onClick={() => onUserClick?.(post.author)}
      >
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<span class="text-white font-medium text-sm">${post.author[0]}</span>`;
          }}
        />
      </div>
     <div className='flex-1'>
      <PostHeader post={post} />

      {/* 根据类型渲染不同的内容 */}
      {renderPostContent()}

      {/* 标签 */}
      <PostTags tags={post.tags} />

      {/* 底部交互按钮和评论区 */}
      <PostFooter post={post} />
    </div>
    </div>
  );
}
