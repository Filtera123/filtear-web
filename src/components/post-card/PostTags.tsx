import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TagItem } from '@components/tag/tag.type.ts';
import Tag from '../tag/Tag';

interface PostTagsProps {
  tags: TagItem[];
  onHeightChange?: () => void;
}

export default function PostTags({ tags, onHeightChange }: PostTagsProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 处理标签点击事件
  const handleTagClick = (tag: string) => {
    navigate(`/tag/${encodeURIComponent(tag)}`);
  };

  // 处理标签展开收起 - 优化版本
  const handleToggleTags = useCallback(() => {
    if (isAnimating) return; // 防止动画期间重复点击

    console.log(`[标签切换] ${showAllTags ? '收起' : '展开'}标签区域`);

    setIsAnimating(true);
    const newShowAllTags = !showAllTags;
    setShowAllTags(newShowAllTags);

    // 使用更精确的动画监听
    const outerContainer = outerContainerRef.current;
    if (outerContainer) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        // 确保只响应max-height属性的过渡结束
        if (event.propertyName === 'max-height') {
          setIsAnimating(false);
          // 动画结束后通知高度变化
          if (onHeightChange) {
            onHeightChange();
          }
          outerContainer.removeEventListener('transitionend', handleTransitionEnd);
        }
      };

      outerContainer.addEventListener('transitionend', handleTransitionEnd);

      // 备用方案：如果transitionend没有触发，使用定时器
      setTimeout(() => {
        if (isAnimating) {
          setIsAnimating(false);
          if (onHeightChange) {
            onHeightChange();
          }
          outerContainer.removeEventListener('transitionend', handleTransitionEnd);
        }
      }, 250);
    }
  }, [showAllTags, isAnimating, onHeightChange]);

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

        // 如果完整高度大于40px（单行限制加一些余量），说明需要展开功能
        setNeedsExpansion(fullHeight > 40);
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
      {/* 标签区域 - 简化动画，只使用高度变化 */}
      <div className="relative">
        <div
          ref={outerContainerRef}
          className="tags-container overflow-hidden transition-all duration-200 ease-out will-change-[max-height]"
          style={{
            maxHeight: showAllTags ? '200px' : '24px',
          }}
        >
          {/* 标签容器 */}
          <div ref={tagsContainerRef} className="flex flex-wrap gap-2 pr-8">
            {/* 显示标签 */}
            {tags.map((tag, index) => (
              <div
                key={`${tag.name}-${index}`}
                data-tag
                className="flex-shrink-0"
                onClick={() => handleTagClick(tag.name)}
              >
                <Tag tag={tag} />
              </div>
            ))}
          </div>
        </div>

        {/* 展开/收起按钮 - 放在第一排右侧 */}
        {needsExpansion && (
          <button
            onClick={handleToggleTags}
            className={`absolute top-0 right-0 flex items-center space-x-0.5 text-xs text-purple-600 hover:text-purple-800 transition-colors bg-white h-6 px-3`}
          >
            <span>{showAllTags ? '收起' : '展开'}</span>
            <svg
              className={`w-2.5 h-2.5 transition-transform ${showAllTags ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
