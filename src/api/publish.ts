import { type TagItem } from '@/components/tag/tag.type';
import { type PrivacyLevel } from '@/components/publish';
import { type PostTypeValue } from '@/components/post-card/post.types';

// 发布内容的基础数据结构
export interface BasePublishData {
  content: string;
  tags: TagItem[];
  privacy: PrivacyLevel;
  type: PostTypeValue;
}

// 图片发布数据
export interface ImagePublishData extends BasePublishData {
  type: 'image';
  images: File[];
}

// 视频发布数据
export interface VideoPublishData extends BasePublishData {
  type: 'video';
  video: File;
}

// 动态发布数据
export interface DynamicPublishData extends BasePublishData {
  type: 'dynamic';
  images?: File[];
}

// 发布数据联合类型
export type PublishData = ImagePublishData | VideoPublishData | DynamicPublishData;

// 发布响应结果
export interface PublishResult {
  code: number;
  message: string;
  data?: {
    postId: string;
    url: string;
  };
}

// 发布进度回调
export type PublishProgressCallback = (progress: number, stage: string) => void;

/**
 * 发布内容
 */
export async function publishContent(
  data: PublishData,
  onProgress?: PublishProgressCallback
): Promise<PublishResult> {
  try {
    onProgress?.(10, '开始上传...');

    // 模拟文件上传过程
    if (data.type === 'image' && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        const progress = 10 + (i / data.images.length) * 70;
        onProgress?.(progress, `上传图片 ${i + 1}/${data.images.length}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else if (data.type === 'video' && data.video) {
      // 模拟视频上传的不同阶段
      onProgress?.(20, '上传视频文件...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onProgress?.(40, '生成视频缩略图...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onProgress?.(60, '处理视频格式...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      onProgress?.(80, '保存视频信息...');
      await new Promise(resolve => setTimeout(resolve, 200));
    } else if (data.type === 'dynamic' && data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        const progress = 10 + (i / data.images.length) * 60;
        onProgress?.(progress, `上传图片 ${i + 1}/${data.images.length}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    onProgress?.(90, '保存发布内容...');
    await new Promise(resolve => setTimeout(resolve, 300));

    onProgress?.(100, '发布完成！');

    // 模拟成功响应
    return {
      code: 200,
      message: '发布成功',
      data: {
        postId: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: `/post/${data.type}/post_${Date.now()}`
      }
    };

  } catch (error) {
    console.error('发布失败:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '发布失败',
    };
  }
}

/**
 * 验证发布数据
 */
export function validatePublishData(data: PublishData): { valid: boolean; error?: string } {
  // 检查内容
  if (!data.content.trim()) {
    return { valid: false, error: '请输入内容' };
  }

  // 检查内容长度
  const maxLength = data.type === 'dynamic' ? 500 : 2000;
  if (data.content.length > maxLength) {
    return { valid: false, error: `内容长度不能超过${maxLength}字` };
  }

  // 检查标签数量
  const maxTags = data.type === 'dynamic' ? 5 : 10;
  if (data.tags.length > maxTags) {
    return { valid: false, error: `标签数量不能超过${maxTags}个` };
  }

  // 类型特定验证
  switch (data.type) {
    case 'image':
      if (!data.images || data.images.length === 0) {
        return { valid: false, error: '请至少上传一张图片' };
      }
      if (data.images.length > 20) {
        return { valid: false, error: '图片数量不能超过20张' };
      }
      break;

    case 'video':
      if (!data.video) {
        return { valid: false, error: '请上传视频文件' };
      }
      break;

    case 'dynamic':
      if (data.images && data.images.length > 9) {
        return { valid: false, error: '动态图片数量不能超过9张' };
      }
      break;
  }

  return { valid: true };
}
