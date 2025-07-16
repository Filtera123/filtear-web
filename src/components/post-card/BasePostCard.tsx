import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleContent, DynamicContent, ImageContent, VideoContent } from './content';
import { PostType, type PostCardProps } from './post.types';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import PostTags from './PostTags';
import CommentSection from '@components/comment/CommentSection.tsx';
import { useCommentStore } from '@/components/comment/Comment.store';
import { Image } from '../ui';

export default function BasePostCard(props: PostCardProps) {
  const { post } = props;
  const postCardRef = React.useRef<HTMLDivElement>(null);
  const { expandedComments } = useCommentStore();
  const navigate = useNavigate();

  // 处理用户头像点击事件
  const handleUserAvatarClick = () => {
    navigate(`/user/${post.author}`);
  };

  // 根据帖子类型渲染不同的内容组件
  const renderPostContent = () => {
    switch (post.type) {
      case PostType.ARTICLE:
        return <ArticleContent post={post} />;
      case PostType.IMAGE:
        return <ImageContent post={post}  />;
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
    <div className={`relative p-4 bg-white  border border-gray-100 ${expandedComments[post.id] ? 'mb-[500px]' : ''}`}>
      <div ref={postCardRef} className={` flex gap-2  `}>
        {/* 头部：用户信息和关注按钮 */}
        {/* 用户头像 */}
        <div
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
          onClick={handleUserAvatarClick}
        >
          <Image
            src={post.authorAvatar}
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover"
            fallbackSrc={`https://via.placeholder.com/40x40?text=${post.author[0]}`}
          />
        </div>
        <div className="flex-1">
          <PostHeader post={post} />

          {/* 根据类型渲染不同的内容 */}
          {renderPostContent()}

          {/* 标签 */}
          <PostTags tags={post.tags} />

          {/* 底部交互按钮和评论区 - 与用户头像对齐 */}
          <div className="ml-[-3rem]">
            <PostFooter post={post} />
          </div>
        </div>
      </div>
      {/* 评论区 - 简单直接的显示/隐藏 */}
      <div
        className="comment-section-container w-full"
      >
        {expandedComments[post.id] && (
          <div className="pt-4 absolute h-[500px] top-[17px] w-full bg-white z-50 overflow-y-auto">
            <CommentSection postId={post.id} comments={post.commentList || []} />
          </div>
        )}
      </div>
    </div>
  );
}
