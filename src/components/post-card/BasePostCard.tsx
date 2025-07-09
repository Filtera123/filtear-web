import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleContent, DynamicContent, ImageContent, VideoContent } from './content';
import { PostType, type PostCardProps } from './post.types';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import PostTags from './PostTags';

export default function BasePostCard(props: PostCardProps) {
  const { post } = props;
  const [showCommentSection, setShowCommentSection] = React.useState(false);
  const postCardRef = React.useRef<HTMLDivElement>(null);
  const targetScrollPositionRef = React.useRef<number | null>(null);
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (targetScrollPositionRef.current === null || !postCardRef.current) return;

    const targetViewportOffset = targetScrollPositionRef.current;
    let attempts = 0;
    const maxAttempts = 20;
    
    const maintainPosition = () => {
      if (!postCardRef.current || attempts >= maxAttempts) {
        targetScrollPositionRef.current = null;
        return;
      }
      
      attempts++;
      
      // 获取帖子当前的位置
      const currentRect = postCardRef.current.getBoundingClientRect();
      const currentOffset = currentRect.top;
      const offsetDiff = currentOffset - targetViewportOffset;
      
      // 如果位置不正确，立即纠正
      if (Math.abs(offsetDiff) > 0.5) {
        window.scrollBy(0, offsetDiff);
        
        // 继续监控
        setTimeout(maintainPosition, 5);
      } else {
        // 位置已稳定，继续监控几次确保不再变动
        if (attempts < 5) {
          setTimeout(maintainPosition, 10);
        } else {
          targetScrollPositionRef.current = null;
        }
      }
    };
    
    // 开始维持位置
    setTimeout(maintainPosition, 0);
  }, [showCommentSection]);

  const handleCommentToggle = () => {
    if (!postCardRef.current) return;

    // 记录当前帖子顶部在视口中的位置（距离视口顶部的距离）
    const rect = postCardRef.current.getBoundingClientRect();
    const viewportOffset = rect.top;
    
    // 记录这个视口偏移量，稍后用它来计算目标滚动位置
    targetScrollPositionRef.current = viewportOffset;
    
    // 切换状态
    setShowCommentSection((prev) => !prev);
  };

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

  return (
    <div ref={postCardRef} className={`bg-white border border-gray-100 p-4 flex gap-2`}>
      {/* 头部：用户信息和关注按钮 */}
      {/* 用户头像 */}
      <div
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
        onClick={handleUserAvatarClick}
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

      {/* 底部交互按钮和评论区 - 与用户头像对齐 */}
      <div className="ml-[-3rem]">
        <PostFooter
          post={post}
          showCommentSection={showCommentSection}
          onCommentToggle={handleCommentToggle}
        />
      </div>
    </div>
    </div>
  );
}
