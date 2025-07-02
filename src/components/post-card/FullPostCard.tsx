import React, { useState, useRef, useEffect } from 'react';
import Tag from '../tag/Tag.tsx';
import CommentSection from '../comment/CommentSection';
import { type Comment } from '../comment/comment.type';

interface PostItem {
  id: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  category: string;
  categorySlug: string;
  readingTime: number;
  title: string;
  content: string;
  tags: string[];
  isLike: boolean;
  likes: number;
  comments: number;
  commentList?: Comment[];
  views?: number;
  isFollowing?: boolean;
}

interface Props {
  post: PostItem;
  onFollow?: (userId: string) => void;
  onLike?: (postId: number) => void;
  onUserClick?: (userId: string) => void;
  onPostClick?: (postId: number) => void;
  onTagClick?: (tag: string) => void;
  onReport?: (postId: number, type: 'post' | 'user') => void;
  onBlock?: (postId: number, type: 'post' | 'user') => void;
  onUnfollow?: (userId: string) => void;
  onAddComment?: (postId: number, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
}

// 格式化数字显示（如1.2k）
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 格式化时间显示
const formatTime = (dateString: string): string => {
  const now = new Date();
  const postTime = new Date(dateString);
  const diffMs = now.getTime() - postTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return postTime.toLocaleDateString('zh-CN');
  }
};

export default function FullPostCard(props: Props) {
  const { post, onFollow, onLike, onUserClick, onPostClick, onTagClick, onReport, onBlock, onUnfollow, onAddComment, onLikeComment, onReplyComment } = props;
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 检测标签是否需要展开功能
  useEffect(() => {
    const checkTagsOverflow = () => {
      if (tagsContainerRef.current && post.tags && post.tags.length > 0) {
        const container = tagsContainerRef.current;
        
        // 临时移除高度限制来获取真实高度
        const originalMaxHeight = container.style.maxHeight;
        const originalOverflow = container.style.overflow;
        
        container.style.maxHeight = 'none';
        container.style.overflow = 'visible';
        
        // 获取完整展开时的高度
        const fullHeight = container.scrollHeight;
        
        // 恢复样式
        container.style.maxHeight = originalMaxHeight;
        container.style.overflow = originalOverflow;
        
        // 如果完整高度大于32px（单行限制），说明需要展开功能
        setNeedsExpansion(fullHeight > 32);
      }
    };

    // 延迟执行以确保DOM已经渲染完成
    const timer = setTimeout(checkTagsOverflow, 100);
    
    // 监听窗口大小变化
    const handleResize = () => {
      setTimeout(checkTagsOverflow, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [post.tags]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
      {/* 头部：用户信息和关注按钮 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
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
          
          {/* 用户名和时间 */}
          <div>
            <div 
              className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onUserClick?.(post.author)}
            >
              {post.author}
            </div>
            <div className="text-gray-500 text-xs">{formatTime(post.createdAt)}</div>
          </div>
        </div>
        
        {/* 关注按钮和更多选项 */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={post.isFollowing ? undefined : () => onFollow?.(post.author)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              post.isFollowing 
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
            }`}
            disabled={post.isFollowing}
          >
            {post.isFollowing ? '已关注' : '关注'}
          </button>
          
          {/* 更多选项按钮 */}
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            
            {/* 下拉菜单 */}
            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onReport?.(post.id, 'post');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报帖子
                </button>
                <button
                  onClick={() => {
                    onBlock?.(post.id, 'post');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽帖子
                </button>
                {post.isFollowing && (
                  <button
                    onClick={() => {
                      onUnfollow?.(post.author);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    取消关注
                  </button>
                )}
                <button
                  onClick={() => {
                    onBlock?.(post.id, 'user');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽用户
                </button>
                <button
                  onClick={() => {
                    onReport?.(post.id, 'user');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报用户
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 帖子标题 */}
      <h2 
        className="text-lg font-semibold text-gray-900 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.title}
      </h2>

      {/* 帖子内容 */}
      <div 
        className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.content}
      </div>

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          {/* 标签区域 */}
          <div className="relative">
            {/* 标签容器 */}
            <div 
              ref={tagsContainerRef}
              className="flex flex-wrap gap-2"
              style={!showAllTags ? {
                overflow: 'hidden',
                maxHeight: '32px' // 限制为单行高度
              } : {}}
            >
              {/* 显示标签 */}
              {post.tags.map((tag, index) => (
                <div 
                  key={`${tag}-${index}`} 
                  data-tag
                  className="flex-shrink-0"
                  onClick={() => onTagClick?.(tag)}
                >
                  <Tag tag={tag} />
                </div>
              ))}
            </div>
            
            {/* 渐变遮罩 - 收起状态下在右侧显示渐变效果 */}
            {!showAllTags && needsExpansion && (
              <div className="absolute top-0 right-0 w-16 h-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            )}
            
            {/* 展开/收起按钮 - 放在第一排右侧 */}
            {needsExpansion && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="absolute top-0 right-0 flex items-center space-x-0.5 text-xs text-blue-600 hover:text-blue-800 transition-colors bg-white h-8 px-2"
              >
                <span>{showAllTags ? '收起' : '展开'}</span>
                <svg 
                  className={`w-2.5 h-2.5 transition-transform ${showAllTags ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 底部交互按钮 */}
      <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
        {/* 浏览量 */}
        <div className="flex items-center space-x-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm">{formatNumber(post.views || 0)}</span>
        </div>

        {/* 点赞 */}
        <button 
          onClick={() => onLike?.(post.id)}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          {post.isLike ? (
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span className="text-sm">{formatNumber(post.likes)}</span>
        </button>

                  {/* 评论 */}
          <button 
            onClick={() => setShowCommentSection(!showCommentSection)}
            className={`flex items-center space-x-1 transition-colors ${
              showCommentSection 
                ? 'text-blue-500' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">{formatNumber(post.comments)}</span>
          </button>
      </div>

      {/* 评论区 */}
      {showCommentSection && (
        <CommentSection
          postId={post.id}
          comments={post.commentList || []}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onReplyComment={onReplyComment}
          onUserClick={onUserClick}
        />
      )}
    </div>
  );
}
