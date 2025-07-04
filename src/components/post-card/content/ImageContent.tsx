import React, { useState } from 'react';
import type { ImagePost } from '../post.types';

interface ImageContentProps {
  post: ImagePost;
  onPostClick?: (postId: number) => void;
}

export default function ImageContent({ post, onPostClick }: ImageContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
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

      {/* 图片描述 */}
      {post.content && (
        <div 
          className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={() => onPostClick?.(post.id)}
        >
          {post.content}
        </div>
      )}

      {/* 图片展示区域 */}
      <div className="mb-3">
        {post.images.length === 1 ? (
          // 单张图片
          <div 
            className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onPostClick?.(post.id)}
          >
            {!imageLoadErrors.has(0) ? (
              <img
                src={post.images[0].url}
                alt={post.images[0].alt || post.title}
                className="w-full max-h-96 object-cover"
                onError={() => handleImageError(0)}
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          // 多张图片轮播
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <div 
              className="cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onPostClick?.(post.id)}
            >
              {!imageLoadErrors.has(currentImageIndex) ? (
                <img
                  src={post.images[currentImageIndex].url}
                  alt={post.images[currentImageIndex].alt || `${post.title} - 图片 ${currentImageIndex + 1}`}
                  className="w-full max-h-96 object-cover"
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 轮播控制按钮 */}
            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 图片指示器 */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                      }`}
                    />
                  ))}
                </div>

                {/* 图片计数 */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {post.images.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 