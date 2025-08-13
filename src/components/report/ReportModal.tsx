import React, { useState, useEffect } from 'react';

// Report categories based on the prototype
enum ReportCategory {
  COPYRIGHT = 'copyright',
  AI_CONTENT = 'ai_content',
  IMAGE_RIGHTS = 'image_rights',
  ILLEGAL = 'illegal',
  OTHER = 'other',
}

// Types for the report form
interface ReportFormData {
  category: ReportCategory | null;
  secondaryCategory?: string | null;
  description?: string;
  evidence?: string;
  identity?: 'individual' | 'legal' | 'not_copyright_owner';
  contactInfo?: string;
  urls?: string[];
  images?: File[];
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  authorId?: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  contentId,
  contentType,
  authorId,
}) => {
  const [formData, setFormData] = useState<ReportFormData>({
    category: null,
    secondaryCategory: null,
  });
  
  // Level of dialog (1 = main categories, 2 = specific form)
  const [dialogLevel, setDialogLevel] = useState<1 | 2>(1);
  
  // 重置状态当弹窗打开时
  useEffect(() => {
    if (isOpen) {
      // 重置表单数据
      setFormData({
        category: null,
        secondaryCategory: null,
      });
      // 重置到一级页面
      setDialogLevel(1);
    }
  }, [isOpen]);

  // 防止背景滚动，同时避免页面偏移
  useEffect(() => {
    if (isOpen) {
      // 获取滚动条宽度
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // 保存当前样式
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // 禁止body滚动并补偿滚动条宽度
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      return () => {
        // 恢复body样式
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategorySelect = (category: ReportCategory) => {
    setFormData({ ...formData, category });
    setDialogLevel(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting report:', { contentId, contentType, authorId, ...formData });
    // Here you would typically send this data to your API
    onClose();
  };

  const goBack = () => {
    if (dialogLevel === 2) {
      setDialogLevel(1);
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Header component for second level dialogs
  const renderHeader = (title: string) => (
    <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  // First level dialog - Category selection
  const renderFirstLevel = () => (
      <div className="p-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-lg font-medium text-gray-900">举报</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        </div>
        
      <div className="space-y-3">
        <button
          onClick={() => handleCategorySelect(ReportCategory.COPYRIGHT)}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
        >
          <div>
            <div className="font-medium">创作者权益保护</div>
            <div className="text-sm text-gray-500">抄袭/无授权搬运/洗稿</div>
          </div>
        </button>
        
        <button
          onClick={() => handleCategorySelect(ReportCategory.AI_CONTENT)}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="font-medium">AI稿件专属通道</div>
        </button>
        
        <button
          onClick={() => handleCategorySelect(ReportCategory.IMAGE_RIGHTS)}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="font-medium">圈层权益保护</div>
          <div className="text-sm text-gray-500">刷屏/炸tag、稿件与tag无关</div>
        </button>
        
          <button
          onClick={() => handleCategorySelect(ReportCategory.ILLEGAL)}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
          <div className="font-medium">违法违规举报</div>
          <div className="text-sm text-gray-500">引战辱骂、恶搞低俗、传播谣言等</div>
          </button>
        
          <button
          onClick={() => handleCategorySelect(ReportCategory.OTHER)}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="font-medium">其它</div>
          </button>
      </div>
    </div>
  );

  // Content for copyright form
  const renderCopyrightForm = () => {
    // 验证版权表单
    const isCopyrightFormValid = () => {
      return (
        formData.identity && // 举报人身份已选择
        formData.description && formData.description.trim() && // 具体问题已填写
        formData.evidence && formData.evidence.trim() // 文字陈述已填写
      );
    };

    return (
      <div className="p-6">
        {renderHeader("举报")}
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-medium">举报理由：抄袭/无授权翻译/洗稿</h3>
          <p className="text-sm text-gray-500">
            抄袭/无授权翻译/洗稿是指在未经原作作者同意的情况下，擅自发布于平台或是未注明出处。
          </p>
        </div>
        
    <div>
          <h4 className="font-medium mb-2">举报人身份</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setFormData({...formData, identity: 'individual'})}
              className={`w-full px-4 py-2 border rounded-md text-center ${
                formData.identity === 'individual' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              我是原创作者
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, identity: 'legal'})}
              className={`w-full px-4 py-2 border rounded-md text-center ${
                formData.identity === 'legal' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              我是法人
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, identity: 'not_copyright_owner'})}
              className={`w-full px-4 py-2 border rounded-md text-center ${
                formData.identity === 'not_copyright_owner' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              不是被侵权人
            </button>
            </div>
          </div>

          <div>
          <label className="block font-medium mb-1">具体问题</label>
            <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            placeholder="据信他人作品，自未取得原作者，或明显出处不正确"
            value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <label className="block font-medium mb-1">原作链接</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="作品链接"
            value={formData.urls?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, urls: e.target.value.split(',')})}
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">文字陈述</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            placeholder="请详细填写相关信息并进行详细描述"
            value={formData.evidence || ''}
            onChange={(e) => setFormData({...formData, evidence: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <label className="block font-medium mb-1">图片证据 (最多4张)</label>
          <div 
            className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('copyright-image-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          >
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="block mt-1 text-sm text-gray-500">点击上传或拖拽文件到这里</span>
          </div>
          <input
            id="copyright-image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          />
          {formData.images && formData.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.images.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images?.filter((_, i) => i !== index);
                      setFormData({...formData, images: newImages});
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            type="submit"
            disabled={!isCopyrightFormValid()}
            className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium ${
              isCopyrightFormValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            提交
          </button>
        </div>
      </form>
    </div>
    );
  };
  
  // Render the AI content form
  const renderAIContentForm = () => {
    // 验证AI内容表单
    const isAIContentFormValid = () => {
      return (
        formData.secondaryCategory && // AI类型已选择
        formData.evidence && formData.evidence.trim() // 文字陈述已填写
      );
    };

    return (
      <div className="p-6">
        {renderHeader("举报")}
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-medium">AI稿件相关类型</h3>
        </div>
        
        <div>
          <div className="space-y-2">
            <div className="text-sm mb-2">
              <p className="font-medium">1.AI侵权：</p>
              <p>人工智能（AI）系统或其使用者在开发、训练或应用过程中，未经授权使用受法律保护的作品或数据，或生成与受保护内容实质性相似的内容，从而侵犯他人知识产权的行为。</p>
            </div>
            
            <div className="text-sm mb-4">
              <p className="font-medium">2.AI生成未标明：</p>
              <p>AI生成内容且未标明，未打Tag</p>
            </div>
            
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, secondaryCategory: 'ai_infringement'})}
                className={`flex-1 px-4 py-2 border rounded-md text-center ${
                  formData.secondaryCategory === 'ai_infringement' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                AI侵权
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, secondaryCategory: 'ai_unmarked'})}
                className={`flex-1 px-4 py-2 border rounded-md text-center ${
                  formData.secondaryCategory === 'ai_unmarked' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                AI生成未标明
              </button>
            </div>
            </div>
          </div>

          <div>
          <label className="block font-medium mb-1">原作品链接</label>
            <input
              type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="链接地址"
            value={formData.urls?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, urls: e.target.value.split(',')})}
            />
          </div>

          <div>
          <label className="block font-medium mb-1">文字陈述</label>
            <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            placeholder="请详细描述问题"
            value={formData.evidence || ''}
              onChange={(e) => setFormData({...formData, evidence: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <label className="block font-medium mb-1">图片证据 (最多4张)</label>
          <div 
            className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('ai-image-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          >
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="block mt-1 text-sm text-gray-500">点击上传或拖拽文件到这里</span>
          </div>
          <input
            id="ai-image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          />
          {formData.images && formData.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.images.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images?.filter((_, i) => i !== index);
                      setFormData({...formData, images: newImages});
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            type="submit"
            disabled={!isAIContentFormValid()}
            className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium ${
              isAIContentFormValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            提交
          </button>
        </div>
      </form>
    </div>
    );
  };
  
  // Render the image rights form (圈层权益保护)
  const renderImageRightsForm = () => {
    // 验证圈层权益保护表单
    const isImageRightsFormValid = () => {
      return (
        formData.secondaryCategory && // 举报类型已选择
        formData.urls && formData.urls.length > 0 && // 至少选择一个tag
        formData.evidence && formData.evidence.trim() && // 稿件链接已填写
        formData.description && formData.description.trim() // 文字陈述已填写
      );
    };

    return (
      <div className="p-6">
        {renderHeader("圈层权益保护")}
        
        <form onSubmit={handleSubmit} className="space-y-4">

        
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            举报类型 
            <span className="text-red-500 ml-1">*</span>
          </h4>
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, secondaryCategory: 'spam_tag'})}
              className={`flex-1 px-4 py-2 border rounded-full text-center ${
                formData.secondaryCategory === 'spam_tag' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              刷屏/炸tag
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, secondaryCategory: 'irrelevant_content'})}
              className={`flex-1 px-4 py-2 border rounded-full text-center ${
                formData.secondaryCategory === 'irrelevant_content' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              稿件与tag无关
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            请选择你要保护的tag 
            <span className="text-red-500 ml-1">*</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {['#tag1', '#tag2', '#tag3', '#tag4'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const selectedTags = formData.urls || [];
                  const isSelected = selectedTags.includes(tag);
                  if (isSelected) {
                    setFormData({...formData, urls: selectedTags.filter(t => t !== tag)});
                  } else {
                    setFormData({...formData, urls: [...selectedTags, tag]});
                  }
                }}
                className={`px-4 py-2 border rounded-full text-center ${
                  (formData.urls || []).includes(tag)
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">显示原稿作打的所有tag，最多选2个</div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            请填写你要举报的稿件链接（若为多个请换行分割）
            <span className="text-red-500 ml-1">*</span>
          </h4>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={4}
            placeholder=""
            value={formData.evidence || ''}
            onChange={(e) => setFormData({...formData, evidence: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            文字陈述
            <span className="text-red-500 ml-1">*</span>
          </h4>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={4}
            placeholder=""
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">图片证据（最多4张），有助于我们更快处理</h4>
          <div 
            className="border border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('image-rights-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          >
            <div className="w-12 h-12 mx-auto border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <input
            id="image-rights-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                const currentImages = formData.images || [];
                const newImages = [...currentImages, ...files].slice(0, 4);
                setFormData({...formData, images: newImages});
              }
            }}
          />
          {formData.images && formData.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.images.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images?.filter((_, i) => i !== index);
                      setFormData({...formData, images: newImages});
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            type="submit"
            disabled={!isImageRightsFormValid()}
            className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium ${
              isImageRightsFormValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            提交
          </button>
        </div>
      </form>
    </div>
    );
  };

  // Based on the selected category and level, show the appropriate form
  const renderSecondLevel = () => {
    switch(formData.category) {
      case ReportCategory.COPYRIGHT:
        return renderCopyrightForm();
      case ReportCategory.AI_CONTENT:
        return renderAIContentForm();
      case ReportCategory.IMAGE_RIGHTS:
        return renderImageRightsForm();
      // Add other category forms as needed
      default:
        // Generic form for other categories
        // 验证通用表单
        const isGenericFormValid = () => {
          return formData.description && formData.description.trim(); // 举报内容描述已填写
        };

        return (
          <div className="p-6">
            {renderHeader("举报")}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-medium">
                  举报理由: {formData.category === ReportCategory.IMAGE_RIGHTS ? '圈层权益保护' : 
                            formData.category === ReportCategory.ILLEGAL ? '违法违规举报' : '其它'}
                </h3>
              </div>
              
              <div>
                <label className="block font-medium mb-1">举报内容描述</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={4}
                  placeholder="请详细描述您要举报的内容..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              
              <div>
                <label className="block font-medium mb-1">图片证据 (选填)</label>
                <div 
                  className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('generic-image-upload')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                    if (files.length > 0) {
                      const currentImages = formData.images || [];
                      const newImages = [...currentImages, ...files].slice(0, 4);
                      setFormData({...formData, images: newImages});
                    }
                  }}
                >
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="block mt-1 text-sm text-gray-500">点击上传或拖拽文件到这里</span>
                </div>
                <input
                  id="generic-image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const currentImages = formData.images || [];
                      const newImages = [...currentImages, ...files].slice(0, 4);
                      setFormData({...formData, images: newImages});
                    }
                  }}
                />
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.images.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images?.filter((_, i) => i !== index);
                            setFormData({...formData, images: newImages});
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={goBack}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            type="submit"
                  disabled={!isGenericFormValid()}
                  className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium ${
                    isGenericFormValid()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  提交
          </button>
        </div>
      </form>
    </div>
  );
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {dialogLevel === 1 ? renderFirstLevel() : renderSecondLevel()}
      </div>
      </div>
  );
};

export default ReportModal;