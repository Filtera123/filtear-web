// ImageDetail.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Popover } from '@chakra-ui/react';
import type { ImagePost } from '@/components/post-card/post.types';
import { usePostActions } from '@/hooks/usePostActions';
import { useBrowsingHistoryStore } from '@/stores/browsingHistoryStore';
import CommentSection from '@/components/comment/CommentSection';
import { useReportContext } from '@/components/report';

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

interface ImageDetailModalProps {
  post: ImagePost;
  initialIndex?: number;
  onClose: () => void;
}

// 图片变换状态接口
interface ImageTransform {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ post, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showToolbar, setShowToolbar] = useState(false);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isOriginalSize, setIsOriginalSize] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { 
    likes, 
    isLike, 
    handleLike, 
    comments, 
    views, 
    formatNumber,
    isFollowing,
    handleFollow,
    handleUnfollow,
    handleBlockUser,
    handleBlockPost
  } = usePostActions(post);
  const { addRecord } = useBrowsingHistoryStore();
  const { openReportModal } = useReportContext();

  // 添加安全检查，确保post和images存在
  if (!post || !post.images || post.images.length === 0) {
    console.error('ImageDetailModal: 无效的帖子数据', post);
    console.error('Post type:', post?.type);
    console.error('Post images:', post?.images);
    
    // 返回错误提示而不是null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-lg font-bold mb-4">加载失败</h2>
          <p className="text-gray-600 mb-4">图片数据无效或缺失</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  const currentImage = post.images[currentIndex];

  // 重置图片变换状态
  const resetImageTransform = useCallback(() => {
    setImageTransform({
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
    });
    setIsOriginalSize(false);
  }, []);

  // 切换原图显示
  const toggleOriginalSize = useCallback(() => {
    if (isOriginalSize) {
      resetImageTransform();
    } else {
      setImageTransform(prev => ({
        ...prev,
        scale: 2, // 原图模式显示200%
      }));
      setIsOriginalSize(true);
    }
  }, [isOriginalSize, resetImageTransform]);

  // 缩放功能 - 微博风格的缩放比例（支持更小比例）
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setImageTransform(prev => {
      let newScale: number;
      
      if (direction === 'in') {
        // 放大：25% -> 50% -> 75% -> 100% -> 125% -> 150% -> 200% -> 300% -> 400% -> 500%
        if (prev.scale < 0.5) newScale = 0.5;
        else if (prev.scale < 0.75) newScale = 0.75;
        else if (prev.scale < 1) newScale = 1;
        else if (prev.scale < 1.25) newScale = 1.25;
        else if (prev.scale < 1.5) newScale = 1.5;
        else if (prev.scale < 2) newScale = 2;
        else if (prev.scale < 3) newScale = 3;
        else if (prev.scale < 4) newScale = 4;
        else if (prev.scale < 5) newScale = 5;
        else newScale = 5; // 最大500%
      } else {
        // 缩小：500% -> 400% -> 300% -> 200% -> 150% -> 125% -> 100% -> 75% -> 50% -> 25%
        if (prev.scale > 4) newScale = 4;
        else if (prev.scale > 3) newScale = 3;
        else if (prev.scale > 2) newScale = 2;
        else if (prev.scale > 1.5) newScale = 1.5;
        else if (prev.scale > 1.25) newScale = 1.25;
        else if (prev.scale > 1) newScale = 1;
        else if (prev.scale > 0.75) newScale = 0.75;
        else if (prev.scale > 0.5) newScale = 0.5;
        else if (prev.scale > 0.25) newScale = 0.25;
        else newScale = 0.25; // 最小25%
      }
      
      return {
        ...prev,
        scale: newScale,
      };
    });
    setIsOriginalSize(false);
  }, []);

  // 旋转功能 - 微博风格的连续旋转（不重置）
  const handleRotate = useCallback(() => {
    setImageTransform(prev => ({
      ...prev,
      rotate: prev.rotate + 90,
    }));
  }, []);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'out' : 'in';
    handleZoom(direction);
  }, [handleZoom]);

  // 鼠标拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (imageTransform.scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imageTransform.translateX,
        y: e.clientY - imageTransform.translateY,
      });
    }
  }, [imageTransform.scale, imageTransform.translateX, imageTransform.translateY]);

  // 鼠标拖拽移动
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && imageTransform.scale > 1) {
      setImageTransform(prev => ({
        ...prev,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  // 鼠标拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 双击重置
  const handleDoubleClick = useCallback(() => {
    resetImageTransform();
  }, [resetImageTransform]);

  // 下载图片
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage.url, currentIndex]);

  // 切换图片时重置变换状态
  useEffect(() => {
    resetImageTransform();
  }, [currentIndex, resetImageTransform]);

  // 禁用背景滚动
  useEffect(() => {
    // 保存当前滚动位置
    const scrollY = window.scrollY;
    const body = document.body;
    
    // 获取滚动条宽度
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // 禁用滚动并防止内容跳动
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      // 恢复滚动
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // 记录浏览历史
  useEffect(() => {
    addRecord({
      id: post.id,
      title: post.title || '图片内容',
      author: post.author,
      authorAvatar: post.authorAvatar,
      type: 'image',
      url: `/post/image/${post.id}`,
      thumbnail: post.images?.[0]?.url,
    });
  }, [post.id]); // 只依赖 post.id，避免重复添加

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % post.images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  const handleThumbnailClick = (index: number) => setCurrentIndex(index);

  // 键盘快捷键
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;

        case '0':
          e.preventDefault();
          resetImageTransform();
          break;
        case '=':
        case '+':
          e.preventDefault();
          handleZoom('in');
          break;
        case '-':
          e.preventDefault();
          handleZoom('out');
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, handlePrev, handleNext, handleRotate, resetImageTransform, handleZoom]);

  if (!post || !post.images || post.images.length === 0) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex w-full min-h-screen text-white" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      {/* 主图区域 */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => {
          setShowToolbar(false);
          handleMouseUp();
        }}
        onClick={e => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : imageTransform.scale > 1 ? 'grab' : 'default' }}
      >
        {/* 顶部工具栏 */}
        {showToolbar && (
          <div className="absolute top-4 right-4 flex gap-2 bg-black bg-opacity-70 px-4 py-2 rounded-xl z-20">
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="旋转90°"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="flex items-center gap-2 bg-black bg-opacity-70 px-3 py-1 rounded-lg">
              <button
                onClick={() => handleZoom('out')}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                title="缩小"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <div className="text-sm font-medium min-w-[3rem] text-center">
                {Math.round(imageTransform.scale * 100)}%
              </div>
              <button
                onClick={() => handleZoom('in')}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                title="放大"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
            <button
              onClick={toggleOriginalSize}
              className={`p-2 rounded transition-colors ${isOriginalSize ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'}`}
              title="原图 (200%)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="下载"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        )}

        {/* 图片计数器 */}
        {showToolbar && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-lg text-sm">
            {currentIndex + 1} / {post.images.length}
          </div>
        )}

        {/* 左右箭头 */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 当前大图 */}
        <div className="max-h-[calc(100vh-160px)] max-w-4xl p-4 flex items-center justify-center">
          <img
            ref={imageRef}
            src={currentImage.url}
            alt={currentImage.alt || post.title}
            className="max-h-full max-w-full object-contain mx-auto select-none"
            style={{
              transform: `scale(${imageTransform.scale}) rotate(${imageTransform.rotate}deg) translate(${imageTransform.translateX}px, ${imageTransform.translateY}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />
        </div>



        {/* 缩略图 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex space-x-2 overflow-x-auto bg-black bg-opacity-70 px-4 py-2 rounded-xl max-w-[80%]">
            {post.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.alt || `img-${index}`}
                onClick={() => handleThumbnailClick(index)}
                className={`w-14 h-14 object-cover rounded-md cursor-pointer transition-opacity duration-200 ${index === currentIndex ? 'opacity-100 border-2 border-white' : 'opacity-60 hover:opacity-80'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右侧信息 + 评论 */}
      <aside className="w-[360px] p-4 bg-white text-black overflow-y-auto border-l border-gray-200" onClick={e => e.stopPropagation()}>
        {/* 作者信息 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img src={post.authorAvatar} alt="头像" className="w-8 h-8 rounded-full mr-2" />
            <div className="text-sm font-medium">{post.author}</div>
          </div>
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`text-sm transition-colors ${
              isFollowing ? 'text-gray-500' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            {isFollowing ? '已关注' : '关注'}
          </button>
        </div>
        {/* 发布时间和正文 */}
        <div className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}>{formatTime(post.createdAt)}</div>
        <div className="text-sm text-gray-700 mb-4" style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}>{post.content}</div>
        {/* 浏览 评论 点赞 */}
        <div className="flex space-x-4 text-xs text-gray-500 mb-4">
          <div className="text-gray-600 text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600">{formatNumber(views)}</span>
          <button className="text-gray-600 hover:text-blue-500 text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">{formatNumber(comments)}</span>
          {/* 点赞 */}
          <button
            onClick={handleLike}
            className={`text-xl transition-colors ${isLike ? 'text-red-500' : 'text-red-600 hover:text-red-500'}`}
          >
            {isLike ? (
              <svg className="w-6 h-6 fill-red-500" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          <span className="text-sm text-gray-600">{formatNumber(likes)}</span>
          {/* 更多操作按钮 */}
          <Popover.Root 
            positioning={{ 
              placement: 'bottom-end',
              strategy: 'absolute'
            }}
            modal={false}
          >
            <Popover.Trigger asChild>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </Popover.Trigger>

            <Popover.Positioner>
              <Popover.Content 
                className="bg-white rounded-lg shadow-lg border-[0.5px] border-gray-200 py-1"
                style={{ zIndex: 9999, width: '80px', minWidth: '80px', maxWidth: '80px' }}
              >
                {isFollowing && (
                  <button
                    onClick={handleUnfollow}
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
                  onClick={() => openReportModal(post.id, 'post', post.author)}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报
                </button>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
        {/* 评论区 */}
        <CommentSection postId={post.id} comments={post.commentList || []} showAllComments={true} />
      </aside>
      {/* 关闭按钮 */}
      <button onClick={onClose} className="absolute top-6 left-6 z-50 bg-black bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-opacity">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default ImageDetailModal;
