// 文件上传API使用示例

import {
  uploadFile,
  uploadAvatar,
  downloadFile,
  createImageUploader,
  createVideoUploader,
  createBatchUploader,
  validateFile,
  compressImage,
  formatFileSize,
} from './index';

// ==================== 基础用法示例 ====================

/**
 * 示例1: 上传用户头像
 */
export async function exampleUploadAvatar(file: File) {
  try {
    // 方法1: 使用专门的头像上传函数
    const result = await uploadAvatar(file, (progress) => {
      console.log(`头像上传进度: ${progress}%`);
    });

    if (result.code === 200) {
      console.log('头像上传成功:', result.data?.key);
      return result.data?.key;
    } else {
      console.error('头像上传失败:', result.message);
    }
  } catch (error) {
    console.error('头像上传异常:', error);
  }
}

/**
 * 示例2: 上传帖子图片
 */
export async function exampleUploadPostImage(file: File) {
  try {
    // 先验证文件
    const validation = validateFile(file, 'post-image');
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // 上传文件
    const result = await uploadFile(file, {
      type: 'post-image',
      compress: true,
      quality: 0.9,
      maxWidth: 2048,
      maxHeight: 2048,
      onProgress: (progress) => {
        console.log(`图片上传进度: ${progress}%`);
      },
    });

    if (result.code === 200) {
      console.log('图片上传成功:');
      console.log('原图key:', result.data?.key);
      console.log('压缩图key:', result.data?.compressedKey);
      return result.data;
    } else {
      alert(`上传失败: ${result.message}`);
    }
  } catch (error) {
    console.error('图片上传异常:', error);
  }
}

/**
 * 示例3: 上传视频文件
 */
export async function exampleUploadVideo(file: File) {
  try {
    const result = await uploadFile(file, {
      type: 'video',
      onProgress: (progress) => {
        console.log(`视频上传进度: ${progress}%`);
      },
    });

    if (result.code === 200) {
      console.log('视频上传成功:', result.data?.key);
      return result.data?.key;
    } else {
      alert(`视频上传失败: ${result.message}`);
    }
  } catch (error) {
    console.error('视频上传异常:', error);
  }
}

/**
 * 示例4: 下载文件
 */
export async function exampleDownloadFile(ossKey: string) {
  try {
    const result = await downloadFile(ossKey);
    
    if (result.code === 200) {
      const downloadUrl = result.data?.url;
      console.log('下载链接:', downloadUrl);
      
      // 在浏览器中打开下载链接
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } else {
      alert(`获取下载链接失败: ${result.message}`);
    }
  } catch (error) {
    console.error('下载失败:', error);
  }
}

// ==================== 高级用法示例 ====================

/**
 * 示例5: 使用图片上传器
 */
export async function exampleImageUploader() {
  const imageUploader = createImageUploader({
    compress: true,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  });

  // 模拟文件选择
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      // 创建预览
      const previewUrl = await imageUploader.createImagePreview(file);
      console.log('预览URL:', previewUrl);

      // 上传图片
      const result = await imageUploader.uploadPostImage(file, (progress) => {
        console.log(`上传进度: ${progress}%`);
      });

      if (result.code === 200) {
        console.log('上传成功:', result.data);
      }
    } catch (error) {
      console.error('处理失败:', error);
    }
  };

  input.click();
}

/**
 * 示例6: 使用视频上传器
 */
export async function exampleVideoUploader() {
  const videoUploader = createVideoUploader();

  // 模拟文件选择
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      // 获取视频信息
      const videoInfo = await videoUploader.getVideoInfo(file);
      console.log('视频信息:', videoInfo);
      console.log(`时长: ${Math.round(videoInfo.duration)}秒`);
      console.log(`分辨率: ${videoInfo.width}x${videoInfo.height}`);
      console.log(`文件大小: ${formatFileSize(videoInfo.size)}`);

      // 创建缩略图
      const thumbnailUrl = await videoUploader.createVideoThumbnail(file);
      console.log('缩略图URL:', thumbnailUrl);

      // 上传视频
      const result = await videoUploader.uploadVideo(file, (progress) => {
        console.log(`上传进度: ${progress}%`);
      });

      if (result.code === 200) {
        console.log('视频上传成功:', result.data);
      }
    } catch (error) {
      console.error('视频处理失败:', error);
    }
  };

  input.click();
}

/**
 * 示例7: 批量上传文件
 */
export async function exampleBatchUpload() {
  const batchUploader = createBatchUploader({
    type: 'post-image',
    compress: true,
    quality: 0.8,
  });

  // 模拟多文件选择
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*';
  
  input.onchange = async (event) => {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    if (files.length === 0) return;

    try {
      // 过滤有效文件
      const validFiles = batchUploader.filterValid(files);
      console.log(`有效文件: ${validFiles.length}/${files.length}`);

      // 创建预览
      const previews = await batchUploader.createPreviews(validFiles);
      console.log('文件预览:', previews);

      // 逐个上传（带进度跟踪）
      const result = await batchUploader.uploadSequentially(
        validFiles,
        {},
        (fileIndex, file, progress) => {
          console.log(`文件 ${fileIndex + 1} (${file.name}) 上传进度: ${progress}%`);
        },
        (fileIndex, file, result) => {
          if (result.code === 200) {
            console.log(`文件 ${fileIndex + 1} (${file.name}) 上传成功`);
          } else {
            console.log(`文件 ${fileIndex + 1} (${file.name}) 上传失败: ${result.message}`);
          }
        }
      );

      console.log('批量上传结果:', result);
      console.log(`成功: ${result.success.length}, 失败: ${result.failed.length}`);
    } catch (error) {
      console.error('批量上传失败:', error);
    }
  };

  input.click();
}

/**
 * 示例8: 图片压缩
 */
export async function exampleImageCompression(file: File) {
  try {
    console.log('原始文件大小:', formatFileSize(file.size));

    // 压缩图片
    const compressedFile = await compressImage(file, {
      quality: 0.7,
      maxWidth: 1024,
      maxHeight: 1024,
      outputFormat: 'jpeg',
    });

    console.log('压缩后文件大小:', formatFileSize(compressedFile.size));
    console.log('压缩比:', `${Math.round((1 - compressedFile.size / file.size) * 100)}%`);

    return compressedFile;
  } catch (error) {
    console.error('图片压缩失败:', error);
  }
}

// ==================== React Hook 示例 ====================

/**
 * 示例9: React Hook - 文件上传
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, options?: any) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadFile(file, {
        ...options,
        onProgress: setProgress,
      });

      if (result.code === 200) {
        return result.data;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '上传失败';
      setError(errorMsg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    upload,
    isUploading,
    progress,
    error,
    reset,
  };
}

// ==================== 实际使用场景示例 ====================

/**
 * 示例10: 编辑器图片上传
 */
export async function handleEditorImageUpload(file: File): Promise<string | null> {
  try {
    const result = await uploadFile(file, {
      type: 'post-image',
      compress: true,
      quality: 0.9,
    });

    if (result.code === 200) {
      // 返回压缩图的URL用于编辑器显示
      const baseUrl = 'https://your-oss-domain.com';
      return `${baseUrl}${result.data?.compressedKey || result.data?.key}`;
    } else {
      alert(`图片上传失败: ${result.message}`);
      return null;
    }
  } catch (error) {
    console.error('编辑器图片上传失败:', error);
    return null;
  }
}

/**
 * 示例11: 用户资料更新
 */
export async function updateUserProfile(avatarFile?: File, backgroundFile?: File) {
  const results = {
    avatar: null as string | null,
    background: null as string | null,
  };

  try {
    // 上传头像
    if (avatarFile) {
      const avatarResult = await uploadAvatar(avatarFile);
      if (avatarResult.code === 200) {
        results.avatar = avatarResult.data?.key || null;
      }
    }

    // 上传背景图
    if (backgroundFile) {
      const bgResult = await uploadFile(backgroundFile, {
        type: 'post-image',
        compress: true,
        maxWidth: 1920,
        maxHeight: 1080,
      });
      if (bgResult.code === 200) {
        results.background = bgResult.data?.key || null;
      }
    }

    // 这里可以调用用户信息更新API
    console.log('准备更新用户资料:', results);
    
    return results;
  } catch (error) {
    console.error('资料更新失败:', error);
    return null;
  }
}

// 需要在React组件中导入useState
function useState<T>(initial: T): [T, (value: T) => void] {
  // 这只是一个示例，实际使用时应该从React导入
  return [initial, () => {}];
}
