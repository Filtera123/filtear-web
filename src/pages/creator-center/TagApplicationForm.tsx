import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TagApplicationFormData {
  tagName: string;
  description: string;
  category: string;
  reason: string;
  examples: string;
  rules: string;
  contactInfo: string;
  additionalInfo: string;
}

const TagApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TagApplicationFormData>({
    tagName: '',
    description: '',
    category: '',
    reason: '',
    examples: '',
    rules: '',
    contactInfo: '',
    additionalInfo: ''
  });

  const [validationError, setValidationError] = useState<string>('');

  const handleInputChange = (field: keyof TagApplicationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationError('');
  };

  const validateForm = (): string => {
    if (!formData.tagName.trim()) return '请输入标签名称';
    if (!formData.description.trim()) return '请输入标签描述';
    if (!formData.category) return '请选择标签分类';
    if (!formData.reason.trim()) return '请说明申请理由';
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
      alert('标签申请已提交，我们会在3-5个工作日内审核并回复');
      navigate('/creator-center');
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'technology', label: '科技' },
    { value: 'lifestyle', label: '生活' },
    { value: 'entertainment', label: '娱乐' },
    { value: 'education', label: '教育' },
    { value: 'sports', label: '体育' },
    { value: 'business', label: '商业' },
    { value: 'art', label: '艺术' },
    { value: 'other', label: '其他' }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 页头 */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/creator-center')}
            className="text-gray-600 hover:opacity-80 transition-opacity mb-4"
          >
            ← 返回创作者中心
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">申请新标签</h1>
          <p className="text-gray-600">
            请详细填写以下信息，我们将在3-5个工作日内审核您的申请
          </p>
        </div>

        {/* 申请表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
              
              {/* 标签名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申请关联的tag名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tagName}
                  onChange={(e) => handleInputChange('tagName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  placeholder="请输入标签名称（2-20个字符）"
                  maxLength={20}
                  {...inputStyle}
                />
              </div>

              {/* 标签分类 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签分类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  {...inputStyle}
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* 标签描述 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="请详细描述该标签的用途和适用范围（50-200字）"
                  rows={4}
                  maxLength={200}
                  {...inputStyle}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/200
                </div>
              </div>
            </div>

            {/* 申请详情 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">申请详情</h2>
              
              {/* 申请理由 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申请理由 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="请说明为什么需要这个标签，以及它能解决什么问题"
                  rows={4}
                  maxLength={500}
                  {...inputStyle}
                />
              </div>

              {/* 使用示例 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  使用示例
                </label>
                <textarea
                  value={formData.examples}
                  onChange={(e) => handleInputChange('examples', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="请提供一些该标签的使用示例"
                  rows={3}
                  maxLength={300}
                  {...inputStyle}
                />
              </div>

              {/* 管理规则 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理规则
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="请说明该标签的管理规则和使用规范"
                  rows={3}
                  maxLength={300}
                  {...inputStyle}
                />
              </div>
            </div>

            {/* 联系信息 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">联系信息</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系方式
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all"
                  placeholder="邮箱或其他联系方式（用于沟通审核结果）"
                  {...inputStyle}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  补充说明
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all resize-none"
                  placeholder="其他需要说明的信息"
                  rows={3}
                  maxLength={200}
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
                disabled={isSubmitting || !!validationError}
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
        </div>

        {/* 说明文字 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">申请须知</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• 标签名称应该简洁明了，避免使用特殊字符</li>
            <li>• 请确保标签具有一定的通用性和使用价值</li>
            <li>• 申请审核通过后，您将成为该标签的管理员</li>
            <li>• 我们保留对不符合规范的标签申请进行拒绝的权利</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TagApplicationForm;