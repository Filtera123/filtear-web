import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ImagePost } from '../post.types';
import { Image } from '../../ui';

interface ImageContentProps {
  post: ImagePost;
  onImageClick?: (post: ImagePost, index: number) => void;
}

// 单个图片项的组件，用于复用样式
const ImageItem: React.FC<{
  imageUrl: string;
  className?: string;
  alt?: string;
  onClick?: () => void;
}> = ({ imageUrl, className = '', alt = '', onClick }) => (
  <div
    className={`cursor-pointer transition-all duration-200 hover:brightness-90 w-full h-full ${className}`}
    onClick={onClick}
  >
    <Image
      src={imageUrl}
      alt={alt}
      className={
        className.includes('object-contain')
          ? 'object-contain object-center'
          : 'w-full h-full object-cover object-center'
      }
      fallbackText={alt || '图片加载失败'}
    />
  </div>
);

export default function ImageContent({ post }: ImageContentProps) {
  const navigate = useNavigate();
  
  // 图片查看状态
  const [isViewing, setIsViewing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  
  const [aspectRatio, setAspectRatio] = useState<string | undefined>();
  const count = post.images.length;

  // 限制最多20张图片
  const limitedImages = post.images.slice(0, 20);

  // 处理图片点击事件
  const handleImageClick = (index: number) => {
    // 优先使用内部查看模式
    setCurrentIndex(index);
    setIsViewing(true);
    // 计算缩略图起始索引，确保当前图片在可见范围内
    const maxThumbnails = 9;
    if (index >= thumbnailStartIndex + maxThumbnails) {
      setThumbnailStartIndex(Math.max(0, index - maxThumbnails + 1));
    } else if (index < thumbnailStartIndex) {
      setThumbnailStartIndex(index);
    }
  };

  // 退出查看模式
  const handleClose = () => {
    setIsViewing(false);
  };

  // 翻页功能
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % limitedImages.length;
    setCurrentIndex(nextIndex);
    // 更新缩略图起始索引
    const maxThumbnails = 9;
    if (nextIndex >= thumbnailStartIndex + maxThumbnails) {
      setThumbnailStartIndex(Math.max(0, nextIndex - maxThumbnails + 1));
    } else if (nextIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + limitedImages.length) % limitedImages.length;
    setCurrentIndex(prevIndex);
    // 更新缩略图起始索引
    const maxThumbnails = 9;
    if (prevIndex >= thumbnailStartIndex + maxThumbnails) {
      setThumbnailStartIndex(Math.max(0, prevIndex - maxThumbnails + 1));
    } else if (prevIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(prevIndex);
    }
  };

  // 查看大图（跳转到详情页）
  const handleViewLarge = () => {
    navigate(`/post/image/${post.id}`, { 
      state: { 
        ...post,
        fromPage: window.location.pathname,
        initialIndex: currentIndex
      } 
    });
  };

  // 切换图片
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // 缩略图导航
  const handleThumbnailNav = (direction: 'prev' | 'next') => {
    const maxThumbnails = 9;
    if (direction === 'prev') {
      setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
    } else {
      setThumbnailStartIndex(Math.min(count - maxThumbnails, thumbnailStartIndex + 1));
    }
  };

  // 键盘事件处理
  useEffect(() => {
    if (!isViewing) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewing, handlePrev, handleNext, handleClose]);

  // 这是处理单张图片的关键:
  // 当只有一张图片时，我们需要加载它来获取原始宽高比
  useEffect(() => {
    if (count === 1) {
      let isMounted = true;
      const img = new window.Image(); // 使用全局的 Image 构造函数
      img.onload = () => {
        if (isMounted) {
          setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
        }
      };
      img.src = limitedImages[0].url;

      // 清理函数，防止组件卸载后仍然尝试设置 state
      return () => {
        isMounted = false;
      };
    }
  }, [limitedImages, count]);

  // 使用 useMemo 缓存要渲染的图片，最多渲染 9 张
  const imagesToRender = useMemo(() => limitedImages.slice(0, 9), [limitedImages]);

  // 主容器的通用样式
  const containerClasses = 'grid overflow-hidden gap-[2px] mb-3 mr-10';

  // 处理文字内容点击事件
  const onPostClick = () => {
    // 优先使用内部查看模式
    handleImageClick(0);
  };

  const handleImageGalleryRender = () => {
    // 根据图片数量返回不同的布局

    if (count === 1) {
      return (
        <div 
          className="overflow-hidden mr-10"
          style={{ 
            aspectRatio,
            maxWidth: '100%',
            width: 'fit-content',
            maxHeight: '320px'
          }}
        >
          <ImageItem
            imageUrl={limitedImages[0].url}
            className="w-full h-full"
            onClick={() => handleImageClick(0)}
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className={`${containerClasses} grid-cols-2`}>
          {imagesToRender.map((img, index) => (
            <div key={index} className="aspect-square">
              <ImageItem imageUrl={img.url} onClick={() => handleImageClick(index)} />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {/* 左侧大图，占据两行 */}
          <div className="row-span-2 aspect-[1/2]">
            <ImageItem
              imageUrl={imagesToRender[0].url}
              onClick={() => handleImageClick(0)}
            />
          </div>
          {/* 右侧两张小图 */}
          <div className="aspect-square">
            <ImageItem imageUrl={imagesToRender[1].url} onClick={() => handleImageClick(1)} />
          </div>
          <div className="aspect-square">
            <ImageItem imageUrl={imagesToRender[2].url} onClick={() => handleImageClick(2)} />
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <div key={index} className="aspect-square">
              <ImageItem imageUrl={img.url} alt={img.alt} onClick={() => handleImageClick(index)} />
            </div>
          ))}
        </div>
      );
    }

    if (count <= 6) {
      return (
        <div className={`${containerClasses} grid-cols-3 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <div key={index} className="aspect-square">
              <ImageItem imageUrl={img.url} alt={img.alt} onClick={() => handleImageClick(index)} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`${containerClasses} grid-cols-3 grid-rows-3`}>
        {imagesToRender.map((img, index) => {
          // 如果是第9张图片（index为8）且还有更多图片，添加剩余数量蒙版
          const isLastDisplayed = index === 8 && count > 9;
          const remainingCount = count - 9;
          
          return (
            <div key={index} className="relative aspect-square">
              <ImageItem imageUrl={img.url} alt={img.alt} onClick={() => handleImageClick(index)} />
              {isLastDisplayed && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                     onClick={() => handleImageClick(index)}>
                  <span className="text-white text-lg font-semibold">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* 帖子标题 */}
      <h2
        className="text-lg font-semibold text-gray-900 mb-4 leading-tight cursor-pointer hover:text-purple-600 transition-colors"
        style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif" }}
        onClick={onPostClick}
      >
        {post.title}
      </h2>

      {/* 图片描述 */}
      {post.content && (
        <div
          className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
          style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif" }}
          onClick={onPostClick}
        >
          {post.content}
        </div>
      )}

      {/* 图片展示区域 */}
      <div className="mb-3">
        {isViewing ? (
          // 图片查看模式
          <div className="bg-gray-100 overflow-hidden mr-10">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClose}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>收起</span>
                </button>

                <button
                  onClick={handleViewLarge}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span>查看大图</span>
                </button>
              </div>
              <div className="text-gray-500 text-sm">
                {currentIndex + 1} / {count}
              </div>
            </div>

            {/* 主图区域 */}
            <div className="h-[500px] flex items-center justify-center bg-gray-50 relative">
              {/* 左侧hover区域 */}
              {limitedImages.length > 1 && (
                <div 
                  className="absolute left-0 top-0 w-1/3 h-full z-10"
                  style={{ cursor: 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDI0TDEyIDE2TDIwIDhWMjRaIiBmaWxsPSIjMDAwIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K\') 16 16, w-resize' }}
                  onClick={handlePrev}
                />
              )}

              {/* 右侧hover区域 */}
              {limitedImages.length > 1 && (
                <div 
                  className="absolute right-0 top-0 w-1/3 h-full z-10"
                  style={{ cursor: 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDhMMjAgMTZMMTIgMjRWOFoiIGZpbGw9IiMwMDAiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPgo=\') 16 16, e-resize' }}
                  onClick={handleNext}
                />
              )}
              
              <img
                src={limitedImages[currentIndex].url}
                alt={limitedImages[currentIndex].alt || post.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* 底部缩略图 */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                {/* 左箭头 */}
                {thumbnailStartIndex > 0 && (
                  <button
                    onClick={() => handleThumbnailNav('prev')}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* 缩略图列表 */}
                <div className="flex space-x-2 overflow-hidden">
                  {limitedImages.slice(thumbnailStartIndex, thumbnailStartIndex + 9).map((img, index) => {
                    const actualIndex = thumbnailStartIndex + index;
                    const isActive = actualIndex === currentIndex;
                    
                    return (
                      <img
                        key={actualIndex}
                        src={img.url}
                        alt={img.alt || `img-${actualIndex}`}
                        onClick={() => handleThumbnailClick(actualIndex)}
                        className={`w-12 h-12 object-cover rounded cursor-pointer transition-all duration-200 ${
                          isActive 
                            ? 'border-2 opacity-100' 
                            : 'opacity-60 hover:opacity-80'
                        }`}
                        style={isActive ? { borderColor: '#7E44C6' } : {}}
                      />
                    );
                  })}
                </div>

                {/* 右箭头 */}
                {thumbnailStartIndex + 9 < count && (
                  <button
                    onClick={() => handleThumbnailNav('next')}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 正常显示模式
          handleImageGalleryRender()
        )}
      </div>
    </div>
  );
}
