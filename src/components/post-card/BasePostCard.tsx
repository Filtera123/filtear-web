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
  const scrollLockRef = React.useRef<{ locked: boolean; position: number }>({ locked: false, position: 0 });
  const navigate = useNavigate();

  // 真正阻止滚动的函数
  const preventAllScroll = React.useCallback(() => {
    const currentPosition = window.scrollY;
    
    // 计算滚动条宽度
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // 阻止各种滚动事件
    const preventScrollEvent = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // 阻止键盘滚动
    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };
    
    // 添加所有滚动相关的事件监听器
    const eventOptions = { passive: false };
    
    window.addEventListener('wheel', preventScrollEvent, eventOptions);
    window.addEventListener('touchmove', preventScrollEvent, eventOptions);
    window.addEventListener('scroll', preventScrollEvent, eventOptions);
    window.addEventListener('keydown', preventKeyScroll, eventOptions);
    
    // CSS层面也阻止滚动，同时补偿滚动条宽度
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${currentPosition}px`;
    document.body.style.left = '0';
    // 关键：补偿滚动条宽度，防止横向抖动
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    
    // 返回清理函数
    return () => {
      window.removeEventListener('wheel', preventScrollEvent);
      window.removeEventListener('touchmove', preventScrollEvent);
      window.removeEventListener('scroll', preventScrollEvent);
      window.removeEventListener('keydown', preventKeyScroll);
      
      // 恢复CSS样式和滚动位置
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.paddingRight = '';
      
      window.scrollTo(0, currentPosition);
    };
  }, []);

  const handleCommentToggle = React.useCallback(() => {
    // 完全阻止滚动
    const restoreScroll = preventAllScroll();
    
    // 切换评论区状态
    setShowCommentSection((prev) => !prev);
    
    // 极短时间后恢复滚动，避免闪烁
    setTimeout(() => {
      restoreScroll();
    }, 10);
  }, [preventAllScroll]);

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
