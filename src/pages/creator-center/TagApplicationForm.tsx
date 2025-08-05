import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TagApplicationFormData {
  tagName: string;                    // 申请tag名称
  relatedTagName: string;             // 申请关联的tag名称
  tagCategory: string;                // tag分类
  tagCategoryOther: string;           // 其他分类
  workName: string;                   // 所属作品
  workScope: string;                  // 分类所属范围  
  workScopeOther: string;            // 其他范围
  featureDescription: string;         // 申请tag区别于同名tag的特征说明
  referenceEvidence: string;          // 相关参考依据
}

export default function TagApplicationForm() {
  const [formData, setFormData] = useState<TagApplicationFormData>({
    tagName: '',
    relatedTagName: '',
    tagCategory: '',
    tagCategoryOther: '',
    workName: '',
    workScope: '',
    workScopeOther: '',
    featureDescription: '',
    referenceEvidence: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // tag分类选项
  const tagCategories = [
    { value: '角色', label: '角色' },
    { value: 'IP作品', label: 'IP作品' },
    { value: '角色关系', label: '角色关系' },
    { value: '其它', label: '其它' }
  ];

  // 分类所属范围选项
  const workScopes = [
    { value: '文学', label: '文学' },
    { value: '电视剧', label: '电视剧' },
    { value: '电影', label: '电影' },
    { value: '动漫', label: '动漫' },
    { value: '游戏', label: '游戏' },
    { value: '历史', label: '历史' },
    { value: '真人同人创作', label: '真人同人创作' },
    { value: '其它', label: '其它' }
  ];

  // 验证tag名称是否相同
  const validateTagNames = (tagName: string, relatedTagName: string) => {
    if (tagName && relatedTagName && tagName.trim() === relatedTagName.trim()) {
      setValidationError('申请关联的tag名称不能与申请tag名称相同');
      return false;
    } else {
      setValidationError('');
      return true;
    }
  };

  // 处理申请tag名称变化
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTagName = e.target.value;
    setFormData(prev => ({ ...prev, tagName: newTagName }));
    validateTagNames(newTagName, formData.relatedTagName);
  };

  // 处理申请关联的tag名称变化
  const handleRelatedTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRelatedTagName = e.target.value;
    setFormData(prev => ({ ...prev, relatedTagName: newRelatedTagName }));
    validateTagNames(formData.tagName, newRelatedTagName);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 提交前最终验证
    if (!validateTagNames(formData.tagName, formData.relatedTagName)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('提交申请数据:', formData);
    setIsSubmitting(false);
    
    // 显示成功弹窗
    setShowSuccessModal(true);
  };

  // 处理成功弹窗完成按钮
  const handleSuccessComplete = () => {
    setShowSuccessModal(false);
    // 返回到进入创作者中心之前的页面
    // -2 表示回到创作者中心的上一页（比如首页）
    navigate(-2);
  };

  // 成功弹窗组件
  const SuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-sm w-full text-center">
        {/* 绿色底白色对勾图标 */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* 标题 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">提交成功</h2>
        
        {/* 内容文字 */}
        <p className="text-gray-600 text-sm leading-relaxed mb-10 px-2">
          您的申请已提交，我们将尽快审核，审核期间请耐心等待，若申请完成我们将进行告知。感谢您的反馈。
        </p>
        
        {/* 完成按钮 */}
        <button
          onClick={handleSuccessComplete}
          className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm"
        >
          完成
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* 标题栏 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          重名tag申请
        </h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          {/* 申请tag名称 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申请tag名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tagName}
              onChange={handleTagNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 申请关联的tag名称 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申请关联的tag名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.relatedTagName}
              onChange={handleRelatedTagNameChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationError && (
              <div className="mt-1 text-sm text-red-600">
                {validationError}
              </div>
            )}
          </div>

          {/* tag分类 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              tag分类：角色/IP作品/角色关系/其它 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tagCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, tagCategory: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">请选择</option>
              {tagCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 其他（tag分类） */}
          {formData.tagCategory === '其它' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                其他 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tagCategoryOther}
                onChange={(e) => setFormData(prev => ({ ...prev, tagCategoryOther: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={formData.tagCategory === '其它'}
              />
            </div>
          )}

          {/* 所属作品 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所属作品 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.workName}
              onChange={(e) => setFormData(prev => ({ ...prev, workName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 分类所属范围 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类所属范围：文学/电视剧/电影/动漫/游戏/历史/真人同人创作/其它
            </label>
            <select
              value={formData.workScope}
              onChange={(e) => setFormData(prev => ({ ...prev, workScope: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">请选择分类范围</option>
              {workScopes.map((scope) => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>
          </div>

          {/* 其他（分类所属范围） */}
          {formData.workScope === '其它' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                其他 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.workScopeOther}
                onChange={(e) => setFormData(prev => ({ ...prev, workScopeOther: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={formData.workScope === '其它'}
              />
            </div>
          )}

          {/* 申请tag区别于同名tag的特征说明 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申请tag区别于同名tag的特征说明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.featureDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, featureDescription: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* 相关参考依据 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相关参考依据（如官方发布链接等） <span className="text-red-500">*</span>
            </label>
            <div className="text-xs text-gray-500 mb-2">
              如官方发布链接等，可提供其他证明链接，方便快速通过
            </div>
            <textarea
              value={formData.referenceEvidence}
              onChange={(e) => setFormData(prev => ({ ...prev, referenceEvidence: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>
        </div>

        {/* 提交区域 */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || !!validationError}
            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>提交中...</span>
              </div>
            ) : (
              '提交'
            )}
          </button>
        </div>
      </form>
      
      {/* 成功弹窗 */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
} 