import React from 'react';

interface PublishSuccessModalProps {
  /** 是否显示弹窗 */
  isOpen: boolean;
  /** 关闭弹窗的回调 */
  onClose: () => void;
  /** 发布的内容类型 */
  type: 'image' | 'video' | 'dynamic';
  /** 发布的内容标题（可选） */
  title?: string;
}

const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
  isOpen,
  onClose,
  type,
  title
}) => {
  if (!isOpen) return null;

  const typeLabels = {
    image: '图片',
    video: '视频', 
    dynamic: '动态'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗内容 */}
        <div className="p-6 text-center">
          {/* 成功图标 */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            发布成功！
          </h3>

          {/* 操作按钮 */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
