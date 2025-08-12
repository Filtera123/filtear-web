import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface TagReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagName: string;
  tagId: string;
}

const VIOLATION_REASONS = [
  '恶意黑tag',
  '引战辱骂',
  '赌博诈骗', 
  '色情低俗',
  '恐怖血腥',
  '垃圾广告',
  '违法犯罪',
  '涉未成年人',
  '涉政敏感',
  '其他'
];

export default function TagReportModal({ isOpen, onClose, tagName, tagId }: TagReportModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [description, setDescription] = useState('');
  const [shouldBlockTag, setShouldBlockTag] = useState(false);

  if (!isOpen) return null;

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    const reportData = {
      tagId,
      tagName,
      reasons: selectedReasons,
      otherReason: selectedReasons.includes('其他') ? otherReason : '',
      description,
      shouldBlockTag
    };
    
    console.log('提交Tag举报:', reportData);
    
    // TODO: 调用API提交举报
    
    // 关闭弹窗
    onClose();
    
    // 重置表单
    setSelectedReasons([]);
    setOtherReason('');
    setDescription('');
    setShouldBlockTag(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 text-center">Tag举报</h2>
        </div>
        
        {/* 内容 */}
        <div className="px-6 py-4 space-y-4">
          {/* 违规tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              违规tag：#{tagName}
            </label>
          </div>
          
          {/* 违规原因 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              违规原因：
            </label>
            <div className="text-xs text-gray-500 mb-3">
              多选违规原因会导致tag，若为误报、快举、引战等恶意举报行为将会对举报者执行相应的处罚措施
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VIOLATION_REASONS.map((reason) => (
                <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    className="w-4 h-4 border-gray-300 rounded transition-all"
                  style={{ color: '#7E44C6' }}
                  onFocus={(e) => (e.target as HTMLElement).style.outline = `2px solid #7E44C6`}
                  onBlur={(e) => (e.target as HTMLElement).style.outline = 'none'}
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 其他原因输入框 */}
          {selectedReasons.includes('其他') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                其他：
              </label>
              <input
                type="text"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="请输入其他原因"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none transition-all"
              onFocus={(e) => {
                (e.target as HTMLElement).style.outline = `2px solid #7E44C6`;
                (e.target as HTMLElement).style.borderColor = 'transparent';
              }}
              onBlur={(e) => {
                (e.target as HTMLElement).style.outline = 'none';
                (e.target as HTMLElement).style.borderColor = '#d1d5db';
              }}
                maxLength={100}
              />
            </div>
          )}
          
          {/* 具体描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              具体描述：
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述违规情况"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              maxLength={500}
            />
          </div>
          
          {/* 屏蔽该tag选项 */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBlockTag}
                onChange={(e) => setShouldBlockTag(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded transition-all"
                  style={{ color: '#7E44C6' }}
                  onFocus={(e) => (e.target as HTMLElement).style.outline = `2px solid #7E44C6`}
                  onBlur={(e) => (e.target as HTMLElement).style.outline = 'none'}
              />
              <span className="text-sm text-gray-700">屏蔽该tag（勾选）</span>
            </label>
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0}
            className={`px-8 py-2 rounded-full font-medium text-sm transition-colors ${
              selectedReasons.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'text-white hover:opacity-90' 
            }`}
            style={selectedReasons.length > 0 ? { backgroundColor: '#7E44C6' } : {}}
          >
            提交
          </button>
        </div>
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}