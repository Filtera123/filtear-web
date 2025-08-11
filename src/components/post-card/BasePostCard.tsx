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
import ImageDetailModal from '@/pages/post-details/ImageDetail';
import VideoDetailModal from '@/pages/post-details/VideoDetail';

export default function BasePostCard({ 
  post, 
  onLike, 
  onUserClick, 
  onPostClick,
  onAddComment,
  onLikeComment,
  onReplyComment,
  onBlockComment,
  onReportComment,
  onBlockUser,
  onHeightChange
}: PostCardProps) {
  const postCardRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const [commentBoxHeight, setCommentBoxHeight] = useState(0);
  const { expandedComments, comments, setComments, toggleCommentLike } = useCommentStore();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // 初始化评论数据
  useEffect(() => {
    if (post.commentList && !comments[post.id]) {
      setComments(post.id, post.commentList);
    }
  }, [post.commentList, post.id, comments, setComments]);

  // 获取当前帖子的评论数据（优先使用store中的数据，因为它包含最新状态）
  const currentComments = comments[post.id] || post.commentList || [];

  // 处理用户头像点击事件
  const handleUserAvatarClick = () => {
    navigate(`/user/${post.author}`);
  };

  // 根据帖子类型生成详情页URL
  const getPostDetailUrl = () => {
    const postId = post.id;
    switch (post.type) {
      case PostType.ARTICLE:
        return `/post/article/${postId}`;
      case PostType.IMAGE:
        return `/post/image/${postId}`;
      case PostType.VIDEO:
        return `/post/video/${postId}`;
      case PostType.DYNAMIC:
        return `/post/dynamic/${postId}`;
      default:
        return `/post/article/${postId}`;
    }
  };

  // 处理"查看全部评论"按钮点击
  const handleViewAllComments = (postId: string) => {
    const url = getPostDetailUrl();
    
    // 对于文章和动态类型，需要滚动到评论区
    if (post.type === PostType.ARTICLE || post.type === PostType.DYNAMIC) {
      navigate(url, { 
        state: { 
          ...post, 
          scrollToComments: true 
        } 
      });
    } else {
      // 其他类型直接跳转
      navigate(url, { state: post });
    }
  };

  // 处理评论点赞
  const handleLikeComment = (commentId: string) => {
    console.log('点赞评论:', commentId);
    // 使用store更新评论点赞状态
    toggleCommentLike(post.id, commentId);
    // TODO: 这里可以添加API调用来同步到服务器
  };

  // 处理添加评论
  const handleAddComment = (postId: string, content: string) => {
    console.log('添加评论到帖子:', postId, '内容:', content);
    // TODO: 这里应该调用API添加新评论
  };

  // 处理回复评论
  const handleReplyComment = (commentId: string, content: string) => {
    console.log('回复评论:', commentId, '内容:', content);
    // TODO: 这里应该调用API添加回复
  };

  // 处理用户点击
  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  // 处理屏蔽评论
  const handleBlockComment = (commentId: string) => {
    console.log('屏蔽评论:', commentId);
    // TODO: 这里应该调用API屏蔽评论
  };

  // 处理举报评论
  const handleReportComment = (commentId: string) => {
    console.log('举报评论:', commentId);
    // TODO: 这里应该调用API举报评论
  };

  // 处理屏蔽用户
  const handleBlockUser = (userId: string) => {
    console.log('屏蔽用户:', userId);
    // TODO: 这里应该调用API屏蔽用户
  };

  // 根据帖子类型渲染不同的内容组件
  const renderPostContent = () => {
    switch (post.type) {
      case PostType.ARTICLE:
        return <ArticleContent post={post} />;
      case PostType.IMAGE:
        return <ImageContent post={post} onImageClick={(p, idx) => { setShowImageModal(true); setModalIndex(idx); }} />;
      case PostType.VIDEO:
        return <VideoContent post={post} onVideoClick={() => setShowVideoModal(true)} />;
      case PostType.DYNAMIC:
        return <DynamicContent post={post} />;
      default:
        // 默认以文章形式显示
        return <ArticleContent post={post} />;
    }
  };

  useEffect(() => {
    const postId = post.id;
    if (commentRef.current && expandedComments[postId]) {
      // 获取评论区的高度
      const height = commentRef.current.getBoundingClientRect().height;
      setCommentBoxHeight(height + 12);

      // 设置评论区的最大高度
      // commentRef.current.style.maxHeight = `${height}px`;
    }
  }, [expandedComments, commentRef, post.id]);

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
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all flex-shrink-0"
          onClick={handleUserAvatarClick}
        >
          <Image
            src={post.authorAvatar}
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover"
            fallbackSrc={`https://via.placeholder.com/40x40?text=${post.author[0]}`}
          />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <PostHeader post={post} />

          {/* 根据类型渲染不同的内容 */}
          {renderPostContent()}

          {/* 标签 */}
          <PostTags tags={post.tags} />

          {/* 底部交互按钮和评论区 - 与用户头像对齐 */}
          <div className="ml-[-3rem]">
            <PostFooter 
        post={post} 
        onLike={onLike}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onReplyComment={handleReplyComment}
        onUserClick={handleUserClick}
        onBlockComment={handleBlockComment}
        onReportComment={handleReportComment}
        onBlockUser={onBlockUser}
        onPostClick={onPostClick}
        onHeightChange={onHeightChange}
      />
          </div>
        </div>
      </div>
      {/* 评论区 - 简单直接的显示/隐藏 */}
      <div className="comment-section-container w-full">
        <div className="absolute top-[17px] w-full bg-white z-50 overflow-y-auto" ref={commentRef}>
          {expandedComments[post.id] && (
            <CommentSection 
              postId={post.id} 
              comments={currentComments} 
              onPostClick={handleViewAllComments}
              onLikeComment={handleLikeComment}
              onAddComment={handleAddComment}
              onReplyComment={handleReplyComment}
              onUserClick={handleUserClick}
              onBlockComment={handleBlockComment}
              onReportComment={handleReportComment}
              onBlockUser={handleBlockUser}
            />
          )}
        </div>
      </div>
      {showImageModal && post.type === PostType.IMAGE && (
        <ImageDetailModal post={post} initialIndex={modalIndex} onClose={() => setShowImageModal(false)} />
      )}
      {showVideoModal && post.type === PostType.VIDEO && (
        <VideoDetailModal post={post} onClose={() => setShowVideoModal(false)} />
      )}
    </div>
  );
}
