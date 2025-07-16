import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackText?: string;
  aspectRatio?: 'square' | 'video' | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = 'https://via.placeholder.com/300x200?text=Image+Not+Found',
  fallbackText = '图片加载失败',
  aspectRatio,
  objectFit = 'cover',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    setHasError(true);
  };
  
  // Calculate aspect ratio styles if needed
  const aspectRatioStyles = aspectRatio 
    ? {
        aspectRatio: typeof aspectRatio === 'number' 
          ? aspectRatio 
          : aspectRatio === 'square' 
            ? '1 / 1' 
            : aspectRatio === 'video' 
              ? '16 / 9'
              : undefined
      }
    : {};
  
  const finalSrc = hasError ? (
    fallbackSrc.includes('?text=') 
      ? fallbackSrc 
      : `${fallbackSrc}?text=${encodeURIComponent(fallbackText)}`
  ) : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{
        objectFit,
        ...aspectRatioStyles,
        ...props.style
      }}
      {...props}
    />
  );
}; 