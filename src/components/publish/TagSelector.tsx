import React, { useState, useRef, useEffect } from 'react';
import { type TagItem } from '@/components/tag/tag.type';

interface TagSelectorProps {
  /** 已选择的标签 */
  selectedTags: TagItem[];
  /** 标签变化回调 */
  onTagsChange: (tags: TagItem[]) => void;
  /** 最大标签数量 */
  maxTags?: number;
  /** 是否禁用 */
  disabled?: boolean;
}

export default function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  maxTags = 20,
  disabled = false 
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<TagItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 模拟热门标签数据
  const popularTags: TagItem[] = [
    { name: '摄影', isPopular: true },
    { name: '生活', isPopular: true },
    { name: '美食', isPopular: true },
    { name: '旅行', isPopular: true },
    { name: '动漫', isPopular: true },
    { name: '游戏', isPopular: true },
    { name: '科技', isPopular: true },
    { name: '音乐', isPopular: true },
    { name: '电影', isPopular: true },
    { name: '读书', isPopular: true },
  ];

  // 搜索标签建议
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = popularTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some(selected => selected.name === tag.name)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);

  // 添加标签
  const handleAddTag = (tag: TagItem | string) => {
    if (selectedTags.length >= maxTags) return;

    const newTag: TagItem = typeof tag === 'string' 
      ? { name: tag.trim() } 
      : tag;

    if (!newTag.name || selectedTags.some(t => t.name === newTag.name)) return;

    onTagsChange([...selectedTags, newTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: TagItem) => {
    onTagsChange(selectedTags.filter(tag => tag.name !== tagToRemove.name));
  };

  // 处理输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  // 点击建议项
  const handleSuggestionClick = (tag: TagItem) => {
    handleAddTag(tag);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">添加标签</label>
        <span className="text-xs text-gray-500">
          {selectedTags.length}/{maxTags}
        </span>
      </div>

      {/* 已选择的标签 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
            >
              <span>#{tag.name}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-purple-600 hover:text-purple-800 ml-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length >= maxTags ? '已达到标签数量上限' : '输入标签名称，按回车添加'}
          disabled={disabled || selectedTags.length >= maxTags}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* 建议列表 */}
        {showSuggestions && suggestions.length > 0 && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
            {suggestions.map((tag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(tag)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-xs"
              >
                <span>#{tag.name}</span>
                {tag.isPopular && (
                  <span className="text-xs text-purple-600">热门</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 热门标签推荐 */}
      {!disabled && inputValue === '' && selectedTags.length < maxTags && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">热门标签推荐：</div>
          <div className="flex flex-wrap gap-2">
            {popularTags
              .filter(tag => !selectedTags.some(selected => selected.name === tag.name))
              .slice(0, 6)
              .map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  #{tag.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
