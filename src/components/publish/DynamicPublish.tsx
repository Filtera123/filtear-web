import React, { useState, useRef, useCallback } from 'react';
import { type TagItem } from '@/components/tag/tag.type';
import TagSelector from './TagSelector';
import PrivacySelector, { type PrivacyLevel } from './PrivacySelector';
import PublishSuccessModal from './PublishSuccessModal';
import { validateFile, uploadFile, type FilePreview } from '@/api';

interface DynamicPublishProps {
  /** 发布成功回调 */
  onPublish?: (postId: string) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

interface DynamicImageFile extends FilePreview {
  id: string;
}

export default function DynamicPublish({ onPublish, onCancel }: DynamicPublishProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<DynamicImageFile[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 9; // 动态最多9张图片
  const MAX_CONTENT_LENGTH = 500; // 动态内容更短

  // 不再使用复杂的上传器封装，直接使用基础函数

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // 检查图片数量限制
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      alert('最多只能上传9张图片');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    // 异步处理文件，类似头像上传的方式
    const processFiles = async () => {
      const newImages: DynamicImageFile[] = [];
      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        // 使用与头像上传相同的验证方式
        const validation = validateFile(file, 'post-image');
        
        if (!validation.valid) {
          alert(`文件 ${file.name} 验证失败: ${validation.error}`);
          continue;
        }

        // 使用与头像上传相同的预览生成方式
        try {
          const previewUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.onerror = () => {
              reject(new Error('文件读取失败'));
            };
            reader.readAsDataURL(file);
          });

          const imageFile: DynamicImageFile = {
            id: `${Date.now()}-${i}`,
            file,
            previewUrl,
            status: 'pending',
            progress: 0,
          };
          
          newImages.push(imageFile);
        } catch (error) {
          alert(`文件 ${file.name} 处理失败`);
        }
      }

      // 更新状态
      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
      }
    };

    processFiles();

    // 清空输入框
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [images.length]);

  // 删除图片
  const handleRemoveImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  // 发布内容
  const handlePublish = async () => {
    if (!content.trim()) {
      alert('请输入动态内容');
      return;
    }

    setIsUploading(true);
    
    try {
      // 逐个上传图片（使用与头像上传相同的方式）
      if (images.length > 0) {
        const uploadResults = [];
        let hasError = false;

        for (let i = 0; i < images.length; i++) {
          const imageFile = images[i];
          
          try {
            // 更新上传状态
            setImages(prev => prev.map(img => 
              img.id === imageFile.id 
                ? { ...img, status: 'uploading', progress: 0 }
                : img
            ));

            // 上传文件
            const result = await uploadFile(imageFile.file, {
              type: 'post-image',
              onProgress: (progress) => {
                setImages(prev => prev.map(img => 
                  img.id === imageFile.id 
                    ? { ...img, progress }
                    : img
                ));
              }
            });

            if (result.code === 200 && result.data) {
              setImages(prev => prev.map(img => 
                img.id === imageFile.id 
                  ? { ...img, status: 'success', progress: 100 }
                  : img
              ));
              uploadResults.push(result.data);
            } else {
              setImages(prev => prev.map(img => 
                img.id === imageFile.id 
                  ? { ...img, status: 'error' }
                  : img
              ));
              hasError = true;
              alert(`图片 ${imageFile.file.name} 上传失败: ${result.message}`);
            }
          } catch (error) {
            setImages(prev => prev.map(img => 
              img.id === imageFile.id 
                ? { ...img, status: 'error' }
                : img
            ));
            hasError = true;
            console.error('图片上传失败:', error);
            alert(`图片 ${imageFile.file.name} 上传失败`);
          }
        }

        if (hasError) {
          return;
        }

        console.log('所有图片上传成功:', uploadResults);
      }

      // 模拟发布内容到后端API
      console.log('发布动态帖子:', {
        content: content.trim(),
        imageCount: images.length,
        tags: selectedTags,
        privacy,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 显示成功弹窗
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 计算图片网格布局类名
  const getGridClassName = (imageCount: number) => {
    if (imageCount === 1) return 'grid-cols-1';
    if (imageCount === 2) return 'grid-cols-2';
    if (imageCount <= 4) return 'grid-cols-2';
    if (imageCount <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 内容输入区域 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">动态内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享此刻的想法..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
          maxLength={MAX_CONTENT_LENGTH}
          disabled={isUploading}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>简短分享，最多{MAX_CONTENT_LENGTH}字</span>
          <span className={content.length > MAX_CONTENT_LENGTH * 0.8 ? 'text-orange-500' : ''}>
            {content.length}/{MAX_CONTENT_LENGTH}
          </span>
        </div>
      </div>

      {/* 图片上传区域 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">添加图片（可选）</label>
          <span className="text-xs text-gray-500">{images.length}/{MAX_IMAGES}</span>
        </div>

        {/* 图片预览网格 */}
        {images.length > 0 && (
          <div className={`grid ${getGridClassName(images.length)} gap-2`}>
            {images.map((image) => (
              <div 
                key={image.id} 
                className={`relative ${
                  images.length === 1 ? 'aspect-video max-h-80' : 'aspect-square'
                }`}
              >
                <img
                  src={image.previewUrl}
                  alt="预览图片"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                
                {/* 上传状态覆盖层 */}
                {image.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-xs mb-1">上传中...</div>
                      <div className="w-8 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${image.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 删除按钮 */}
                {!isUploading && (
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 添加图片按钮 - 使用与头像上传相同的结构 */}
        {images.length < MAX_IMAGES && !isUploading && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors block">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500">
              点击或拖拽添加图片
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}

        <div className="text-xs text-gray-500">
          支持 JPG、PNG、GIF 格式，单张图片最大 10MB，最多上传 {MAX_IMAGES} 张
        </div>
      </div>

      {/* 标签选择 */}
      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        disabled={isUploading}
        maxTags={5} // 动态标签数量限制更少
      />

      {/* 隐私设置 */}
      <PrivacySelector
        value={privacy}
        onChange={setPrivacy}
        disabled={isUploading}
      />

      {/* 底部操作按钮 */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={isUploading || !content.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isUploading && (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>{isUploading ? '发布中...' : '发布动态'}</span>
        </button>
      </div>

      {/* 发布成功弹窗 */}
      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // 重置表单
          setContent('');
          setImages([]);
          setSelectedTags([]);
          setPrivacy('public');
          // 通知发布成功并关闭发布窗口
          onPublish?.('mock-dynamic-post-id');
          onCancel?.();
        }}
        type="dynamic"
        title={content.length > 20 ? content.substring(0, 20) + '...' : content}
      />
    </div>
  );
}
