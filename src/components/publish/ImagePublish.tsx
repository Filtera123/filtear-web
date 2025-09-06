import React, { useState, useRef, useCallback } from 'react';
import { type TagItem } from '@/components/tag/tag.type';
import TagSelector from './TagSelector';
import PrivacySelector, { type PrivacyLevel } from './PrivacySelector';
import PublishSuccessModal from './PublishSuccessModal';
import { validateFile, uploadFile, type FilePreview } from '@/api';

interface ImagePublishProps {
  /** 发布成功回调 */
  onPublish?: (postId: string) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

interface ImageFile extends FilePreview {
  id: string;
}

export default function ImagePublish({ onPublish, onCancel }: ImagePublishProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 20;
  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 2000;
  
  // 不再使用复杂的上传器封装，直接使用基础函数

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // 检查图片数量限制
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      alert('最多只能上传20张图片');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    // 异步处理文件，类似头像上传的方式
    const processFiles = async () => {
      const newImages: ImageFile[] = [];
      
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

          const imageFile: ImageFile = {
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
    if (!title.trim() && !content.trim() && images.length === 0) {
      alert('请输入标题、内容或上传图片');
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
      console.log('发布图片帖子:', {
        title: title.trim(),
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

  return (
    <div className="p-6 space-y-4">
      {/* 图片上传区域 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">上传图片</label>
          <span className="text-xs text-gray-500">{images.length}/{MAX_IMAGES}</span>
        </div>

        {/* 图片预览网格 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 已上传的图片 */}
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square">
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
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}


            </div>
          ))}

          {/* 添加图片按钮 - 使用与头像上传相同的结构 */}
          {images.length < MAX_IMAGES && !isUploading && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-500 text-center">
                点击或拖拽<br />添加图片
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
        </div>

        <div className="text-xs text-gray-500">
          支持 JPG、PNG、GIF 格式，单张图片最大 10MB，最多上传 {MAX_IMAGES} 张
        </div>
      </div>

      {/* 标题输入区域 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          maxLength={MAX_TITLE_LENGTH}
          disabled={isUploading}
        />
        <div className="flex justify-end text-xs text-gray-500">
          <span>{title.length}/{MAX_TITLE_LENGTH}</span>
        </div>
      </div>

      {/* 内容输入区域 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">正文</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="正文"
          className="w-full h-24 px-2 py-1 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          maxLength={MAX_CONTENT_LENGTH}
          disabled={isUploading}
        />
        <div className="flex justify-end text-xs text-gray-500">
          <span>{content.length}/{MAX_CONTENT_LENGTH}</span>
        </div>
      </div>

      {/* 标签选择 */}
      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        maxTags={20}
        disabled={isUploading}
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
          disabled={isUploading || (!title.trim() && !content.trim() && images.length === 0)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isUploading && (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>{isUploading ? '发布中...' : '发布'}</span>
        </button>
      </div>

      {/* 发布成功弹窗 */}
      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // 重置表单
          setTitle('');
          setContent('');
          setImages([]);
          setSelectedTags([]);
          setPrivacy('public');
          // 通知发布成功并关闭发布窗口
          onPublish?.('mock-post-id');
          onCancel?.();
        }}
        type="image"
        title={title}
      />
    </div>
  );
}
