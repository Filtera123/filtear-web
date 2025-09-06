import React, { useState, useRef, useCallback } from 'react';
import { type TagItem } from '@/components/tag/tag.type';
import TagSelector from './TagSelector';
import PrivacySelector, { type PrivacyLevel } from './PrivacySelector';
import PublishSuccessModal from './PublishSuccessModal';
import { formatFileSize, validateFile, uploadFile } from '@/api';

interface VideoPublishProps {
  /** 发布成功回调 */
  onPublish?: (postId: string) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

interface VideoFile {
  id: string;
  file: File;
  previewUrl: string;
  duration?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  thumbnail?: string;
}

export default function VideoPublish({ onPublish, onCancel }: VideoPublishProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 2000;
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

  // 不再使用复杂的上传器封装，直接使用基础函数

  // 获取视频缩略图
  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 跳转到视频的第1秒处获取缩略图
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } else {
          reject(new Error('无法生成缩略图'));
        }
      };

      video.onerror = () => reject(new Error('视频加载失败'));
      
      video.src = URL.createObjectURL(videoFile);
    });
  };

  // 处理视频文件选择
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件（使用与头像上传相同的方式）
    const validation = validateFile(file, 'video');
    if (!validation.valid) {
      alert(`文件验证失败: ${validation.error}`);
      return;
    }

    try {
      // 创建视频预览URL
      const previewUrl = URL.createObjectURL(file);
      
      // 生成缩略图
      const thumbnail = await generateThumbnail(file);

      // 获取视频时长
      const video = document.createElement('video');
      video.src = previewUrl;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const newVideo: VideoFile = {
            id: `video-${Date.now()}`,
            file,
            previewUrl,
            duration: video.duration,
            thumbnail,
            status: 'pending',
            progress: 0,
          };
          
          setVideo(newVideo);
          resolve(null);
        };
      });

    } catch (error) {
      console.error('处理视频文件失败:', error);
      alert('视频文件处理失败，请重试');
    }

    // 清空输入框
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 删除视频
  const handleRemoveVideo = useCallback(() => {
    if (video) {
      URL.revokeObjectURL(video.previewUrl);
      setVideo(null);
    }
  }, [video]);

  // 格式化时长
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 发布内容
  const handlePublish = async () => {
    if (!title.trim() && !content.trim() && !video) {
      alert('请输入标题、内容或上传视频');
      return;
    }

    if (!video) {
      alert('请上传视频');
      return;
    }

    setIsUploading(true);
    
    try {
      // 上传视频到后端
      setVideo(prev => prev ? { ...prev, status: 'uploading', progress: 0 } : null);

      const uploadResult = await uploadFile(video.file, {
        type: 'video',
        onProgress: (progress) => {
          setVideo(prev => prev ? { ...prev, progress } : null);
        }
      });

      if (uploadResult.code !== 200 || !uploadResult.data) {
        setVideo(prev => prev ? { ...prev, status: 'error' } : null);
        alert(`视频上传失败: ${uploadResult.message}`);
        return;
      }

      setVideo(prev => prev ? { ...prev, status: 'success', progress: 100 } : null);

      // 模拟发布内容到后端API
      console.log('发布视频帖子:', {
        title: title.trim(),
        content: content.trim(),
        videoKey: uploadResult.data.key,
        videoSize: uploadResult.data.size,
        tags: selectedTags,
        privacy,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 显示成功弹窗
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
      setVideo(prev => prev ? { ...prev, status: 'error' } : null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* 视频上传区域 */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">上传视频</label>

        {video ? (
          // 视频预览
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={video.previewUrl}
              controls
              className="w-full max-h-80 object-contain"
              poster={video.thumbnail}
            />
            
            {/* 上传状态覆盖层 */}
            {video.status === 'uploading' && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-lg mb-2">上传中...</div>
                  <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                  <div className="text-sm mt-2">{video.progress}%</div>
                </div>
              </div>
            )}

            {/* 删除按钮 */}
            {!isUploading && (
              <button
                onClick={handleRemoveVideo}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 bg-opacity-75 text-white rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
              >
                ×
              </button>
            )}

            {/* 视频信息 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm font-medium truncate">{video.file.name}</div>
                  <div className="text-xs text-gray-300">
                    {formatFileSize(video.file.size)}
                    {video.duration && ` • ${formatDuration(video.duration)}`}
                  </div>
                </div>
                {video.status === 'success' && (
                  <div className="text-green-400 text-xs">✓ 上传完成</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 上传区域 - 使用与头像上传相同的结构
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors block">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="text-lg font-medium text-gray-700 mb-2">上传视频文件</div>
            <div className="text-sm text-gray-500">
              点击选择或拖拽视频文件到此处
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}

        <div className="text-xs text-gray-500">
          支持 MP4、MOV、AVI 等格式，最大 {formatFileSize(MAX_VIDEO_SIZE)}
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
          disabled={isUploading || (!title.trim() && !content.trim() && !video)}
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
          setVideo(null);
          setSelectedTags([]);
          setPrivacy('public');
          // 通知发布成功并关闭发布窗口
          onPublish?.('mock-video-post-id');
          onCancel?.();
        }}
        type="video"
        title={title}
      />
    </div>
  );
}
