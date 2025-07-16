import { useEffect, useRef, useState } from 'react';
import CommentSection from '@components/comment/CommentSection.tsx';
import { useNavigate } from 'react-router-dom';
import { useCommentStore } from '@/components/comment/Comment.store';
import { Image } from '../ui';
import { ArticleContent, DynamicContent, ImageContent, VideoContent } from './content';
import { PostType, type PostCardProps } from './post.types';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import PostTags from './PostTags';

export default function BasePostCard(props: PostCardProps) {
  const { post } = props;
  const postCardRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const [commentBoxHeight, setCommentBoxHeight] = useState(0);
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

  useEffect(() => {
    if (commentRef.current && expandedComments[post.id]) {
      // 获取评论区的高度
      const height = commentRef.current.getBoundingClientRect().height;
      setCommentBoxHeight(height + 12);

      // 设置评论区的最大高度
      // commentRef.current.style.maxHeight = `${height}px`;
    }
  }, [expandedComments, commentRef]);

  return (
    <div
      className={`relative p-4 bg-white  border border-gray-100`}
      style={{
        marginBottom: expandedComments[post.id] ? `${commentBoxHeight}px` : '0px',
      }}
    >
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
      <div className="comment-section-container w-full">
        <div className="absolute top-[17px] w-full bg-white z-50 overflow-y-auto" ref={commentRef}>
          {expandedComments[post.id] && (
            <CommentSection postId={post.id} comments={post.commentList || []} />
          )}
        </div>
      </div>
    </div>
  );
}
