import React, { useState, useRef, useEffect } from 'react';
import Tag from '../tag/Tag';

interface PostTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function PostTags({ tags, onTagClick }: PostTagsProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // 检测标签是否需要展开功能
  useEffect(() => {
    const checkTagsOverflow = () => {
      if (tagsContainerRef.current && tags && tags.length > 0) {
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
  }, [tags]);

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
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
          {tags.map((tag, index) => (
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
  );
} 