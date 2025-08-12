import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IconX, IconArrowLeft } from '@tabler/icons-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetUser?: string;
}

interface FormData {
  reason: string;
  description: string;
  identity: string;
  contact: string;
  evidence: string;
  originalUrl: string;
  copyrightOwner: string;
  aiTool: string;
  aiPurpose: string;
  imageOwner: string;
  imageSource: string;
}

const VIOLATION_REASONS = [
  '垃圾信息',
  '违法违规',
  '色情内容',
  '暴力血腥',
  '恶意诽谤',
  '赌博诈骗',
  '其他'
];

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  targetUser 
}) => {
  const [step, setStep] = useState(1);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    reason: '',
    description: '',
    identity: '',
    contact: '',
    evidence: '',
    originalUrl: '',
    copyrightOwner: '',
    aiTool: '',
    aiPurpose: '',
    imageOwner: '',
    imageSource: ''
  });

  if (!isOpen) return null;

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交
    alert('举报已提交，我们会尽快处理');
    onClose();
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canSubmit = formData.description.length >= 10;

  const renderHeader = (title: string) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {step > 1 && (
        <button
          onClick={goBack}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <IconArrowLeft size={20} className="mr-1" />
        </button>
      )}
      <h3 className="text-lg font-semibold flex-1 text-center">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
      >
        <IconX size={20} />
      </button>
    </div>
  );

  const renderFirstLevel = () => (
    <div>
      {renderHeader('举报原因')}
      <div className="p-6">
        <div className="space-y-3">
          {VIOLATION_REASONS.map((reason) => {
            const isSelected = selectedReasons.includes(reason);
            return (
              <label key={reason} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleReasonToggle(reason)}
                  className="mr-3"
                />
                <span 
                  className={`py-2 px-3 rounded border flex-1 ${
                    isSelected 
                      ? 'text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={isSelected ? { 
                    backgroundColor: '#7E44C6', 
                    borderColor: '#7E44C6' 
                  } : {}}
                >
                  {reason}
                </span>
              </label>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={selectedReasons.length === 0}
            className="px-6 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#7E44C6' }}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetailForm = () => (
    <div>
      {renderHeader('详细说明')}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              举报原因
            </label>
            <div className="text-sm text-gray-600">
              {selectedReasons.join(', ')}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              rows={4}
              placeholder="请详细描述违规情况（至少10个字符）"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系方式
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="邮箱或手机号（选填）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相关证据
            </label>
            <textarea
              value={formData.evidence}
              onChange={(e) => setFormData({...formData, evidence: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              rows={3}
              placeholder="提供相关证据链接或说明（选填）"
              maxLength={300}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={goBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#7E44C6' }}
          >
            提交举报
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? renderFirstLevel() : renderDetailForm()}
      </div>
    </div>,
    document.body
  );
};

export default ReportModal;