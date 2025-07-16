import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ImagePost } from '../post.types';
import { Image } from '../../ui';

interface ImageContentProps {
  post: ImagePost;
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
  const onPostClick = () => {
    navigate(`/post/image/${post.id}`,{state: { post }});
  };

  const [aspectRatio, setAspectRatio] = useState<string | undefined>();
  const count = post.images.length;

  // 限制最多20张图片
  const limitedImages = post.images.slice(0, 20);
  const imageCount = limitedImages.length;

  // 处理帖子内容点击事件
  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

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
          <ImageItem
            imageUrl={limitedImages[0].url}
            className="w-full h-full"
            onClick={onPostClick}
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className={`${containerClasses} grid-cols-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} onClick={onPostClick} />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {/* 左侧大图，占据两行 */}
          <ImageItem
            imageUrl={imagesToRender[0].url}
            className="row-span-2"
            onClick={onPostClick}
          />
          {/* 右侧两张小图 */}
          <ImageItem imageUrl={imagesToRender[1].url} onClick={onPostClick} />
          <ImageItem imageUrl={imagesToRender[2].url} onClick={onPostClick} />
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className={`${containerClasses} grid-cols-2 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} alt={img.alt} onClick={onPostClick} />
          ))}
        </div>
      );
    }

    if (count <= 6) {
      return (
        <div className={`${containerClasses} grid-cols-3 grid-rows-2`}>
          {imagesToRender.map((img, index) => (
            <ImageItem key={index} imageUrl={img.url} alt={img.alt} onClick={onPostClick} />
          ))}
        </div>
      );
    }

    return (
      <div className={`${containerClasses} grid-cols-3 grid-rows-3`}>
        {imagesToRender.map((img, index) => (
          <ImageItem key={index} imageUrl={img.url} alt={img.alt} onClick={onPostClick} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* 帖子标题 */}
      <h2
        className="text-lg font-semibold text-gray-900 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={onPostClick}
      >
        {post.title}
      </h2>

      {/* 图片描述 */}
      {post.content && (
        <div
          className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={onPostClick}
        >
          {post.content}
        </div>
      )}

      {/* 图片展示区域 */}
      <div className="mb-3">{handleImageGalleryRender()}</div>
    </div>
  );
}
