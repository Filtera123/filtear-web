import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PostType, type PostTypeValue } from '@/components/post-card/post.types';
import ImagePublish from './ImagePublish';
import VideoPublish from './VideoPublish';
import DynamicPublish from './DynamicPublish';

export interface PublishModalProps {
  /** 是否显示弹窗 */
  isOpen: boolean;
  /** 发布类型 */
  type: PostTypeValue | null;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 发布成功回调 */
  onPublishSuccess?: (postId: string) => void;
}

export default function PublishModal({ 
  isOpen, 
  type, 
  onClose, 
  onPublishSuccess 
}: PublishModalProps) {
  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case PostType.IMAGE:
        return '发布图片';
      case PostType.VIDEO:
        return '发布视频';
      case PostType.DYNAMIC:
        return '发布动态';
      default:
        return '发布内容';
    }
  };

  const renderPublishContent = () => {
    switch (type) {
      case PostType.IMAGE:
        return <ImagePublish onPublish={onPublishSuccess} onCancel={onClose} />;
      case PostType.VIDEO:
        return <VideoPublish onPublish={onPublishSuccess} onCancel={onClose} />;
      case PostType.DYNAMIC:
        return <DynamicPublish onPublish={onPublishSuccess} onCancel={onClose} />;
      default:
        return null;
    }
  };

  if (!isOpen || !type) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 发布内容区域 */}
        <div className="flex-1 overflow-y-auto">
          {renderPublishContent()}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
