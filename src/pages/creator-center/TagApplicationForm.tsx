import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Card, 
  CardContent
} from '@mui/material';

interface TagApplicationFormData {
  duplicateTagName: string;
  tagName: string;
  category: string;
  customCategory: string;
  workName: string;
  contentTypes: string[];
  customContentType: string;
  explanation: string;
  reference: string;
}

const TagApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessPage, setIsSuccessPage] = useState(false);
  const [formData, setFormData] = useState<TagApplicationFormData>({
    duplicateTagName: '',
    tagName: '',
    category: '',
    customCategory: '',
    workName: '',
    contentTypes: [],
    customContentType: '',
    explanation: '',
    reference: ''
  });

  const [validationError, setValidationError] = useState<string>('');

  // 禁用/启用body滚动
  useEffect(() => {
    if (isSuccessPage) {
      // 保存原始样式
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      // 禁用滚动
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // 添加全局样式来隐藏所有滚动条
      const style = document.createElement('style');
      style.id = 'modal-overlay-styles';
      style.innerHTML = `
        * {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* IE/Edge */
        }
        *::-webkit-scrollbar {
          display: none !important; /* Chrome/Safari */
        }
        body, html {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
      
      // 清理函数
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        const styleEl = document.getElementById('modal-overlay-styles');
        if (styleEl) {
          styleEl.remove();
        }
      };
    }
  }, [isSuccessPage]);

  const handleInputChange = (field: keyof TagApplicationFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationError('');
  };

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
    setValidationError('');
  };

  const validateForm = (): string => {
    if (!formData.duplicateTagName.trim()) return '请输入申请的重名tag名称';
    if (!formData.tagName.trim()) return '请输入申请关联的tag名称';
    if (formData.duplicateTagName.trim() === formData.tagName.trim()) return '申请关联的tag名称不能与申请的重名tag名称相同';
    if (!formData.category && !formData.customCategory.trim()) return '请选择tag分类或填写其他分类';
    if (!formData.workName.trim()) return '请输入所属作品';
    if (formData.contentTypes.length === 0 && !formData.customContentType.trim()) return '请选择分类所属范畴或填写其他类型';
    if (!formData.explanation.trim()) return '请填写申请tag区别于同名tag的特征说明';
    if (!formData.reference.trim()) return '请填写相关参考依据';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccessPage(true);
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    // 返回到进入创作者中心前的页面
    // -2 是因为需要跳过当前页面和创作者中心页面
    navigate(-2);
  };

  const categories = [
    { value: 'character', label: '角色' },
    { value: 'ip-work', label: 'IP作品' },
    { value: 'character-relation', label: '角色关系' },
    { value: 'other', label: '其他' }
  ];

  const contentTypes = [
    '文学', '电视剧', '电影', '动漫', '游戏', '历史', '真人同人创作', '其它'
  ];

  const inputStyle = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      (e.target as HTMLElement).style.outline = '2px solid #7E44C6';
      (e.target as HTMLElement).style.borderColor = '#7E44C6';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      (e.target as HTMLElement).style.outline = 'none';
      (e.target as HTMLElement).style.borderColor = '#d1d5db';
    }
  };



  // 申请表单页面
  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">tag关联申请</h1>
        <p className="text-gray-600">请详细填写以下信息，我们将在3-5个工作日内审核您的申请</p>
      </div>

      {/* 申请表单 */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
              
              {/* 申请的重名tag名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申请的重名tag名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duplicateTagName}
                  onChange={(e) => handleInputChange('duplicateTagName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  placeholder="请输入重名tag名称"
                  {...inputStyle}
                />
              </div>

              {/* 申请关联的tag名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申请关联的tag名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tagName}
                  onChange={(e) => handleInputChange('tagName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  placeholder="请输入标签名称"
                  {...inputStyle}
                />
              </div>

              {/* tag分类 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  tag分类 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat.value} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{cat.label}</span>
                    </label>
                  ))}
                </div>
                {formData.category === 'other' && (
                  <input
                    type="text"
                    value={formData.customCategory}
                    onChange={(e) => handleInputChange('customCategory', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md transition-all"
                    placeholder="请输入其他分类"
                    {...inputStyle}
                  />
                )}
              </div>

              {/* 所属作品 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属作品 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.workName}
                  onChange={(e) => handleInputChange('workName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  placeholder="请输入所属作品名称"
                  {...inputStyle}
                />
              </div>
            </div>

            {/* 申请详情 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">申请详情</h2>

              {/* 分类所属范畴 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  分类所属范畴 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {contentTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.contentTypes.includes(type)}
                        onChange={() => handleContentTypeToggle(type)}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
                {formData.contentTypes.includes('其它') && (
                  <input
                    type="text"
                    value={formData.customContentType}
                    onChange={(e) => handleInputChange('customContentType', e.target.value)}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md transition-all"
                    placeholder="其他"
                    {...inputStyle}
                  />
                )}
              </div>

              {/* 申请tag区别于同名tag的特征说明 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申请tag区别于同名tag的特征说明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="请详细说明申请的tag与同名tag的区别特征"
                  rows={4}
                  {...inputStyle}
                />
              </div>

              {/* 相关参考依据 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  相关参考依据（如官方宣发链接等） <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="如官方宣发链接等"
                  rows={3}
                  {...inputStyle}
                />
              </div>
            </div>

            {/* 错误提示 */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {validationError}
              </div>
            )}

            {/* 提交区域 */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: '#7E44C6' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>提交中...</span>
                  </div>
                ) : (
                  '提交申请'
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 成功提交弹窗 - 使用Portal渲染到body */}
      {isSuccessPage && createPortal(
        <div 
          style={{ 
            position: 'fixed',
            left: 0, 
            right: 0, 
            top: 0, 
            bottom: 0, 
            width: '100vw', 
            height: '100vh',
            minWidth: '100vw',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 2147483647, // 最大z-index值
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            // 强制覆盖滚动条区域
            transform: 'translateZ(0)', // 创建新的层叠上下文
            willChange: 'transform' // 优化性能
          }}
          onWheel={(e) => e.preventDefault()} // 阻止滚动事件
        >
          {/* 弹窗内容 */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-8 text-center space-y-6">
              {/* 绿底白勾图标 */}
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              {/* 标题 */}
              <h2 className="text-xl font-bold text-gray-900">提交成功</h2>
              
              {/* 描述文字 */}
              <p className="text-gray-600 leading-relaxed text-sm">
                您的申请已提交，我们将尽快审核，审核期间请耐心等待，若申请完成我们将进行告知。感谢您的反馈。
              </p>
              
              {/* 完成按钮 */}
              <button
                onClick={handleComplete}
                className="px-8 py-3 text-white rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#7E44C6' }}
              >
                完成
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TagApplicationForm;