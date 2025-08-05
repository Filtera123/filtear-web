import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from '@chakra-ui/react';
import { useReportContext } from '../report/ReportContext';
import { Image } from './Image';
import Tag from '../tag/Tag';
import { PostType, type PostItem, type ArticlePost, type ImagePost, type VideoPost, type DynamicPost } from '../post-card/post.types';
import { cn } from '../../utils/cn';

interface TumblrCardProps {
  post: PostItem;
  onLikeClick?: (post: PostItem, liked: boolean) => void;
  onUserClick?: (username: string) => void;
  onCommentClick?: (post: PostItem) => void;
  showActions?: boolean;
  maxImageHeight?: number;
}

export default function TumblrCard({ 
  post, 
  onLikeClick,
  onUserClick,
  onCommentClick,
  showActions = true,
  maxImageHeight = 600
}: TumblrCardProps) {
  const navigate = useNavigate();
  const { openReportModal } = useReportContext();
  const [isLiked, setIsLiked] = useState(post.isLike);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);

  // 根据帖子类型生成正确的URL - 复用BasePostCard的实现
  const getPostDetailUrl = useCallback(() => {
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
  }, [post.type, post.id]);

  const handleCardClick = () => {
    navigate(getPostDetailUrl(), { state: post });
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.author);
    } else {
      navigate(`/user/${post.author}`);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    onLikeClick?.(post, newLikeState);
  };

  // 处理取消关注
  const handleUnfollowClick = () => {
    setIsFollowing(false);
    console.log(`取消关注用户: ${post.author}`);
  };

  // 处理举报
  const handleReport = () => {
    console.log(`举报: ${post.id}`);
    openReportModal(post.id, 'post', post.author);
  };

  // 处理屏蔽帖子
  const handleBlockPost = () => {
    console.log(`屏蔽帖子: ${post.id}`);
  };

  // 处理屏蔽用户
  const handleBlockUser = () => {
    console.log(`屏蔽用户: ${post.author}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCommentClick?.(post);
  };

  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.stopPropagation();
    navigate(`/tag/${tagName}`);
  };

  // 时间格式化函数 - 复用PostHeader的实现
  const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}天前`;
    } else {
      return created.toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric' 
      });
    }
  };

  const getImageAspectRatio = () => {
    if (post.type === PostType.IMAGE && post.images?.[0]) {
      const { width, height } = post.images[0];
      if (width && height) {
        const ratio = height / width;
        // 限制宽高比在合理范围内，避免过于极端的尺寸
        return Math.max(0.5, Math.min(2, ratio));
      }
    }
    return 0.75; // 默认3:4比例
  };

  const renderMedia = () => {
    switch (post.type) {
      case PostType.IMAGE:
        if (post.images && post.images.length > 0) {
          return (
            <div className="relative overflow-hidden">
              <div
                className="w-full relative"
                style={{ 
                  aspectRatio: getImageAspectRatio()
                }}
              >
                <Image
                  src={post.images[0].url}
                  alt={post.images[0].alt || post.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
                {post.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    +{post.images.length - 1}
                  </div>
                )}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </div>
            </div>
          );
        }
        break;

      case PostType.VIDEO:
        if (post.video) {
          return (
            <div className="relative overflow-hidden bg-black">
              <div
                className="w-full relative"
                style={{ 
                  aspectRatio: '16/9'
                }}
              >
                <Image
                  src={post.video.thumbnail}
                  alt="视频缩略图"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {post.video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(post.video.duration / 60)}:{String(post.video.duration % 60).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          );
        }
        break;

      case PostType.DYNAMIC:
        if (post.images && post.images.length > 0) {
          return (
            <div className="relative overflow-hidden">
              <div
                className="w-full relative"
                style={{ 
                  aspectRatio: getImageAspectRatio()
                }}
              >
                <Image
                  src={post.images[0].url}
                  alt={post.images[0].alt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        }
        break;
    }
    return null;
  };

  const renderContent = () => {
    switch (post.type) {
      case PostType.ARTICLE: {
        const articlePost = post as ArticlePost;
        // 根据摘要长度动态设置截断行数
        const getAbstractLineClamp = () => {
          if (!articlePost.abstract) return '';
          const length = articlePost.abstract.length;
          if (length <= 80) return ''; // 短摘要不截断
          if (length <= 150) return 'line-clamp-4';
          if (length <= 250) return 'line-clamp-6';
          return 'line-clamp-8';
        };
        
        return (
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
              {articlePost.title}
            </h3>
            {articlePost.abstract && (
              <p className={`text-gray-600 text-sm mb-3 ${getAbstractLineClamp()}`}>
                {articlePost.abstract}
              </p>
            )}
            {articlePost.wordCount && (
              <div className="text-xs text-gray-400 mb-2">
                约 {articlePost.wordCount} 字
              </div>
            )}
          </div>
        );
      }

      case PostType.IMAGE: {
        const imagePost = post as ImagePost;
        // 根据图片帖子内容长度动态设置截断
        const getImageContentLineClamp = () => {
          if (!imagePost.content || imagePost.content === imagePost.title) return '';
          const length = imagePost.content.length;
          if (length <= 50) return ''; // 短内容不截断
          if (length <= 100) return 'line-clamp-3';
          return 'line-clamp-4';
        };
        
        return imagePost.title !== imagePost.content ? (
          <div className="p-4">
            <h3 className="font-medium text-base mb-2 line-clamp-2 text-gray-900">
              {imagePost.title}
            </h3>
            {imagePost.content && imagePost.content !== imagePost.title && (
              <p className={`text-gray-600 text-sm ${getImageContentLineClamp()}`}>
                {imagePost.content}
              </p>
            )}
          </div>
        ) : null;
      }

      case PostType.VIDEO: {
        const videoPost = post as VideoPost;
        // 根据视频帖子内容长度动态设置截断
        const getVideoContentLineClamp = () => {
          if (!videoPost.content || videoPost.content === videoPost.title) return '';
          const length = videoPost.content.length;
          if (length <= 50) return ''; // 短内容不截断
          if (length <= 100) return 'line-clamp-3';
          return 'line-clamp-4';
        };
        
        return videoPost.title !== videoPost.content ? (
          <div className="p-4">
            <h3 className="font-medium text-base mb-2 line-clamp-2 text-gray-900">
              {videoPost.title}
            </h3>
            {videoPost.content && videoPost.content !== videoPost.title && (
              <p className={`text-gray-600 text-sm ${getVideoContentLineClamp()}`}>
                {videoPost.content}
              </p>
            )}
          </div>
        ) : null;
      }

             case PostType.DYNAMIC: {
         const dynamicPost = post as DynamicPost;
         // 根据动态内容长度动态设置显示策略
         const getDynamicLineClamp = () => {
           const length = dynamicPost.content.length;
           if (length <= 60) return ''; // 很短的内容完全显示
           if (length <= 120) return 'line-clamp-3';
           if (length <= 200) return 'line-clamp-5';
           if (length <= 300) return 'line-clamp-7';
           return 'line-clamp-10';
         };
         
         return (
           <div className="p-4">
             <p className={`text-gray-800 text-sm whitespace-pre-wrap ${getDynamicLineClamp()}`}>
               {dynamicPost.content}
             </p>
           </div>
         );
       }
    }
  };

  return (
    <div 
      className={cn(
        'bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100',
        'cursor-pointer hover:shadow-md transition-all duration-200',
        'break-inside-avoid mb-4 group'
      )}
      style={{ minWidth: '200px' }}
      onClick={handleCardClick}
    >
      {/* 顶部用户信息栏 */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center justify-between min-w-0">
          <div 
            className="flex items-center space-x-2 hover:opacity-70 transition-opacity flex-1 min-w-0"
            onClick={handleUserClick}
            style={{ minWidth: '120px' }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                className="w-full h-full object-cover"
                fallbackSrc={`https://via.placeholder.com/32x32?text=${post.author[0]}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-900 truncate font-medium block">
                {post.author}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(post.createdAt)}
              </span>
            </div>
          </div>
          
          {/* 右上角菜单按钮 - 复用PostHeader的Popover菜单 */}
          <Popover.Root 
            positioning={{ 
              placement: 'bottom-end',
              strategy: 'absolute'
            }}
            modal={false}
          >
            <Popover.Trigger asChild>
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </Popover.Trigger>

            <Popover.Positioner>
              <Popover.Content 
                className="bg-white rounded-lg shadow-lg border-[0.5px] border-gray-200 py-1"
                style={{ zIndex: 9999, width: '80px', minWidth: '80px', maxWidth: '80px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {isFollowing && (
                  <button
                    onClick={handleUnfollowClick}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    取消关注
                  </button>
                )}
                <button
                  onClick={handleBlockPost}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽帖子
                </button>
                <button
                  onClick={handleBlockUser}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽用户
                </button>
                <button
                  onClick={handleReport}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报
                </button>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      </div>

      {/* 媒体内容 */}
      {renderMedia()}

      {/* 文本内容 */}
      {renderContent()}

      {/* 底部区域 - 标签和操作按钮 */}
      <div className="border-t border-gray-50">
        {/* 标签区域 - 复用主页帖子列表的Tag组件 */}
        {post.tags && post.tags.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 5).map((tag, index) => (
                <div key={tag.id || index} onClick={(e) => handleTagClick(e, tag.name)}>
                  <Tag tag={tag} />
                </div>
              ))}
              {post.tags.length > 5 && (
                <span className="text-xs text-gray-400 self-center">
                  +{post.tags.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 底部操作栏 - 去掉分享按钮 */}
        {showActions && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-50">
            <div className="flex items-center justify-between">
              {/* 浏览量 */}
              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs">{post.views || 0}</span>
              </div>



              {/* 点赞按钮 */}
              <button
                onClick={handleLikeClick}
                className={cn(
                  'flex items-center space-x-1 transition-colors hover:text-red-500',
                  isLiked ? 'text-red-500' : 'text-gray-500'
                )}
              >
                <svg 
                  className="w-4 h-4" 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs">{(post.likes || 0) + (isLiked && !post.isLike ? 1 : 0) - (!isLiked && post.isLike ? 1 : 0)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 