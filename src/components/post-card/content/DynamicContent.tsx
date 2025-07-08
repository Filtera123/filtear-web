import React, { useState } from 'react';
import type { DynamicPost } from '../post.types';

interface DynamicContentProps {
  post: DynamicPost;
  onPostClick?: (postId: string) => void;
}

export default function DynamicContent({ post, onPostClick }: DynamicContentProps) {
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => new Set(prev).add(index));
  };

  // 限制最多9张图片
  const limitedImages = post.images ? post.images.slice(0, 9) : [];
  const imageCount = limitedImages.length;

  // 根据图片数量决定布局样式
  const getImageLayout = () => {
    switch (imageCount) {
      case 1:
        return 'single';
      case 2:
        return 'double';
      case 4:
        return 'grid2x2';
      default:
        return 'grid3x3';
    }
  };

  const layout = getImageLayout();

  // 单张图片布局
  const renderSingleImage = () => (
    <div
      className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity aspect-square max-w-sm"
      onClick={() => onPostClick?.(post.id)}
    >
      {!imageLoadErrors.has(0) ? (
        <img
          src={limitedImages[0].url}
          alt={limitedImages[0].alt || post.title}
          className="w-full h-full object-cover"
          onError={() => handleImageError(0)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );

  // 两张图片布局
  const renderDoubleImages = () => (
    <div className="grid grid-cols-2 gap-2 max-w-sm">
      {limitedImages.slice(0, 2).map((image, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity aspect-square"
          onClick={() => onPostClick?.(post.id)}
        >
          {!imageLoadErrors.has(index) ? (
            <img
              src={image.url}
              alt={image.alt || `${post.title} - 图片 ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 四张图片田字格布局
  const renderGrid2x2 = () => (
    <div className="grid grid-cols-2 gap-2 max-w-md">
      {limitedImages.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity aspect-[4/3]"
          onClick={() => onPostClick?.(post.id)}
        >
          {!imageLoadErrors.has(index) ? (
            <img
              src={image.url}
              alt={image.alt || `${post.title} - 图片 ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 九宫格布局
  const renderGrid3x3 = () => {
    const displayImages = limitedImages.slice(0, 9);
    const remainingCount = imageCount - 9;

    return (
      <div className="grid grid-cols-3 gap-2">
        {displayImages.map((image, index) => {
          const isLastItem = index === 8 && remainingCount > 0;

          return (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity aspect-square"
              onClick={() => onPostClick?.(post.id)}
            >
              {!imageLoadErrors.has(index) ? (
                <>
                  <img
                    src={image.url}
                    alt={image.alt || `${post.title} - 图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />

                  {/* 显示剩余图片数量 */}
                  {isLastItem && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">+{remainingCount}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
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
        className="text-lg font-semibold text-gray-900 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.title}
      </h2>

      {/* 动态内容 */}
      <div
        className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 7,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        onClick={() => onPostClick?.(post.id)}
      >
        {post.content}
      </div>

      {/* 配图展示 */}
      {imageCount > 0 && (
        <div className="mb-3">
          {layout === 'single' && renderSingleImage()}
          {layout === 'double' && renderDoubleImages()}
          {layout === 'grid2x2' && renderGrid2x2()}
          {layout === 'grid3x3' && renderGrid3x3()}

          {/* 图片数量和查看全部提示 */}
          {imageCount > 1 && (
            <div className="flex items-center justify-between mt-2 text-gray-500 text-xs">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>共 {imageCount} 张图片</span>
              </div>

              <button
                onClick={() => onPostClick?.(post.id)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                查看全部
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
