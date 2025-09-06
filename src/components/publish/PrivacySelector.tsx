import React, { useState, useRef, useEffect } from 'react';

export type PrivacyLevel = 'public' | 'followers' | 'private';

interface PrivacySelectorProps {
  /** 当前隐私设置 */
  value: PrivacyLevel;
  /** 隐私设置变化回调 */
  onChange: (privacy: PrivacyLevel) => void;
  /** 是否禁用 */
  disabled?: boolean;
}

const privacyOptions = [
  {
    value: 'public' as PrivacyLevel,
    label: '公开',
    description: '所有人都可以看到',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: 'followers' as PrivacyLevel,
    label: '仅粉丝',
    description: '只有关注你的用户可以看到',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
  {
    value: 'private' as PrivacyLevel,
    label: '仅自己',
    description: '只有你自己可以看到',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function PrivacySelector({ 
  value, 
  onChange, 
  disabled = false 
}: PrivacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = privacyOptions.find(option => option.value === value);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (privacy: PrivacyLevel) => {
    onChange(privacy);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">发布权限设置</label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="inline-flex items-center justify-between px-2 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-w-24"
        >
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              {currentOption?.icon}
            </div>
            <span className="text-gray-700">{currentOption?.label}</span>
          </div>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 下拉菜单 */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-48">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-xs ${
                  value === option.value ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
              >
                <div className={`${
                  value === option.value ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
                {value === option.value && (
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
