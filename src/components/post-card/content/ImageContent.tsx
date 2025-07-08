import React, { useEffect, useMemo, useState } from 'react';
import type { ImagePost } from '../post.types';

interface ImageContentProps {
  post: ImagePost;
  onPostClick?: (postId: number) => void;
}

// 单个图片项的组件，用于复用样式
const ImageItem: React.FC<{ imageUrl: string; className?: string; alt?: string }> = ({
  imageUrl,
  className = '',
  alt = '',
}) => (
  <div
    className={`cursor-pointer transition-all duration-200 hover:brightness-90 w-full h-full ${className}`}
  >
    <img src={imageUrl} alt={alt} className={`w-full h-full object-cover object-center`} />
  </div>
);

export default function ImageContent({ post, onPostClick }: ImageContentProps) {
  const [aspectRatio, setAspectRatio] = useState<string | undefined>();
  const count = post.images.length;

  // 限制最多20张图片
  const limitedImages = post.images.slice(0, 20);
  const imageCount = limitedImages.length;

  // 这是处理单张图片的关键:
  // 当只有一张图片时，我们需要加载它来获取原始宽高比
  useEffect(() => {
    if (count === 1) {
      let isMounted = true;
      const img = new Image();
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
  const containerClasses = 'grid h-[410px] rounded-2xl overflow-hidden gap-[2px] mb-3';

  const handleImageGalleryRender = () => {
    // 根据图片数量返回不同的布局

    if (count === 1) {
      return (
        <div className="h-[410px] rounded-2xl overflow-hidden" style={{ aspectRatio }}>
          <ImageItem imageUrl={limitedImages[0].url} className="w-full h-full" />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className={`${containerClasses} grid-cols-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {/* 左侧大图，占据两行 */}
          <ImageItem imageUrl={imagesToRender[0].url} className="row-span-2" />
          {/* 右侧两张小图 */}
          <ImageItem imageUrl={imagesToRender[1].url} />
          <ImageItem imageUrl={imagesToRender[2].url} />
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} alt={img.alt} />
          ))}
        </div>
      );
    }

    if (count <= 6) {
      return (
        <div className={`${containerClasses} grid-cols-3 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} alt={img.alt} />
          ))}
        </div>
      );
    }

    return (
      <div className={`${containerClasses} grid-cols-3 grid-rows-2`}>
        {imagesToRender.map((img, index) => (
          <ImageItem key={index} imageUrl={img.url} alt={img.alt} />
        ))}
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
      <div className="mb-3">{handleImageGalleryRender()}</div>

      {/* 图片数量和查看全部提示 */}
      {imageCount > 1 && (
        <div className="flex items-center justify-between text-gray-500 text-xs">
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
  );
}
