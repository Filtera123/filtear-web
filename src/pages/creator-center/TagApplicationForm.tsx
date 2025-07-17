import React, { useState, useRef } from 'react';
import { 
  IconSearch, 
  IconUpload, 
  IconHelp, 
  IconX,
  IconCheck
} from '@tabler/icons-react';

interface TagApplicationFormData {
  tagName: string;
  associationType: 'character' | 'work' | 'other';
  ipName: string;
  fullName: string;
  description: string;
  proofImages: File[];
}

export default function TagApplicationForm() {
  const [formData, setFormData] = useState<TagApplicationFormData>({
    tagName: '',
    associationType: 'character',
    ipName: '',
    fullName: '',
    description: '',
    proofImages: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTagSearch, setShowTagSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [tagSearchResults, setTagSearchResults] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟搜索tag结果
  const handleTagSearch = () => {
    if (formData.tagName.trim()) {
      // 模拟API调用
      const mockResults = [
        '阿明 - 《进击的巨人》',
        '阿明 - 《火影忍者》',
        '阿明 - 《海贼王》'
      ];
      setTagSearchResults(mockResults);
      setShowTagSearch(true);
    }
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      proofImages: [...prev.proofImages, ...files]
    }));
  };

  // 移除上传的文件
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proofImages: prev.proofImages.filter((_, i) => i !== index)
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('提交申请数据:', formData);
    setIsSubmitting(false);
    
    // 这里可以添加成功提示或跳转逻辑
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 标题栏 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          申请关联重名 tag
        </h1>
        <p className="text-sm text-gray-600">
          已有同名 tag？提交信息为你的 IP / 角色申请专属关联 tag
        </p>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基础信息填写区 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基础信息</h2>
          
          {/* 标签名称 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签名称 *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.tagName}
                onChange={(e) => setFormData(prev => ({ ...prev, tagName: e.target.value }))}
                placeholder="请输入需要关联的重名 tag（例：阿明）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={handleTagSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <IconSearch size={18} />
              </button>
            </div>
            
            {/* 搜索结果 */}
            {showTagSearch && tagSearchResults.length > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">当前关联的 IP：</span>
                  <button
                    type="button"
                    onClick={() => setShowTagSearch(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IconX size={16} />
                  </button>
                </div>
                <ul className="space-y-1">
                  {tagSearchResults.map((result, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 关联类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关联类型 *
            </label>
            <select
              value={formData.associationType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                associationType: e.target.value as 'character' | 'work' | 'other' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="character">角色</option>
              <option value="work">作品</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        {/* 详细信息填写区 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">详细信息</h2>
          
          {/* 所属 IP 名称 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所属 IP 名称 *
            </label>
            <input
              type="text"
              value={formData.ipName}
              onChange={(e) => setFormData(prev => ({ ...prev, ipName: e.target.value }))}
              placeholder="请填写该 tag 对应的具体 IP（例：《进击的巨人》）"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 角色/作品全称 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.associationType === 'character' ? '角色' : formData.associationType === 'work' ? '作品' : '项目'}全称 *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder={`请填写完整名称（例：${formData.associationType === 'character' ? '阿明·阿诺德' : formData.associationType === 'work' ? '进击的巨人' : '项目名称'}）`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 补充说明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              补充说明
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="可选：填写该 IP / 角色的其他信息（如原作类型、出场设定等），帮助审核更快通过"
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.description.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* 证明材料上传区 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">证明材料</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <IconUpload size={20} />
              <span>+ 上传证明图片</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              可选：上传官方资料截图（如角色设定集、作品封面等）辅助审核
            </p>
          </div>

          {/* 已上传的文件列表 */}
          {formData.proofImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">已上传文件：</h3>
              <div className="space-y-2">
                {formData.proofImages.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 提交区域 */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
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
          <p className="text-sm text-orange-600 mt-2">
            审核结果将在 3 个工作日内通过系统消息通知你
          </p>
        </div>

        {/* 状态提示区 */}
        {isSubmitting && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">审核中</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </form>

      {/* 悬浮帮助按钮 */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <IconHelp size={20} />
      </button>

      {/* 帮助弹窗 */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">常见问题</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">审核不通过会怎样？</h4>
                <p className="text-gray-600">审核不通过时，系统会发送详细说明邮件，您可以根据反馈修改后重新申请。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">关联 tag 格式是什么？</h4>
                <p className="text-gray-600">关联 tag 格式为：原tag名称 - IP名称，例如："阿明 - 《进击的巨人》"</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">需要提供哪些证明材料？</h4>
                <p className="text-gray-600">建议提供官方设定集、作品封面、角色介绍等官方资料截图，有助于提高审核通过率。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 