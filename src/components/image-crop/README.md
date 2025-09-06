# 🖼️ 图片裁剪上传功能

完整的图片裁剪上传解决方案，支持头像、背景图等多种场景的智能裁剪和手动裁剪。

## ✨ 功能特性

- 🎯 **智能裁剪**: 自动计算最佳裁剪区域
- 🖱️ **手动裁剪**: 可拖拽调整的裁剪框
- 📱 **组件化**: 开箱即用的上传组件
- 🔄 **多比例支持**: 1:1、16:9、4:3、21:9 等
- 📊 **实时预览**: 裁剪过程实时预览
- 🚀 **无缝集成**: 与现有上传API完美结合

## 🚀 快速开始

### 1. 头像上传（推荐）

```tsx
import { AvatarUpload } from '@/components/image-crop';

function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <AvatarUpload
      currentAvatar={avatarUrl}
      onUploadSuccess={(url, key) => {
        setAvatarUrl(url);
        console.log('头像上传成功:', key);
      }}
      onUploadError={(error) => {
        console.error('上传失败:', error);
      }}
      size="lg"
    />
  );
}
```

### 2. 背景图上传

```tsx
import { BackgroundUpload } from '@/components/image-crop';

function ProfileBackground() {
  const [backgroundUrl, setBackgroundUrl] = useState('');

  return (
    <BackgroundUpload
      currentBackground={backgroundUrl}
      onUploadSuccess={(url, key) => {
        setBackgroundUrl(url);
      }}
      height="200px"
      cropType="background"
    />
  );
}
```

### 3. 智能API上传

```tsx
import { uploadAvatarWithAutoCrop, uploadBackgroundWithAutoCrop } from '@/api';

// 智能头像上传（自动裁剪为正方形）
const handleAvatarUpload = async (file: File) => {
  const result = await uploadAvatarWithAutoCrop(file, (progress) => {
    console.log(`上传进度: ${progress}%`);
  });
  
  if (result.code === 200) {
    console.log('上传成功:', result.data);
  }
};

// 智能背景图上传（自动裁剪为16:9）
const handleBackgroundUpload = async (file: File) => {
  const result = await uploadBackgroundWithAutoCrop(file);
  
  if (result.code === 200) {
    console.log('背景图上传成功:', result.data);
  }
};
```

## 📋 API 参考

### 组件 API

#### AvatarUpload

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| currentAvatar | string | - | 当前头像URL |
| onUploadSuccess | (url: string, key: string) => void | - | 上传成功回调 |
| onUploadError | (error: string) => void | - | 上传失败回调 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | 头像尺寸 |
| disabled | boolean | false | 是否禁用 |

#### BackgroundUpload

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| currentBackground | string | - | 当前背景图URL |
| onUploadSuccess | (url: string, key: string) => void | - | 上传成功回调 |
| onUploadError | (error: string) => void | - | 上传失败回调 |
| height | string | '200px' | 显示高度 |
| cropType | 'background' \| 'cover' \| 'banner' | 'background' | 裁剪类型 |

#### ImageCropModal

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| isOpen | boolean | - | 是否显示模态框 |
| imageFile | File \| null | - | 原始图片文件 |
| cropType | keyof typeof CROP_PRESETS | - | 裁剪类型 |
| onCropComplete | (file: File) => void | - | 裁剪完成回调 |
| onCancel | () => void | - | 取消回调 |

### 上传 API

#### uploadWithCrop(file, cropArea, options)

手动裁剪上传

```tsx
import { uploadWithCrop, type CropArea } from '@/api';

const cropArea: CropArea = {
  x: 100,
  y: 100,
  width: 300,
  height: 300
};

const result = await uploadWithCrop(file, cropArea, {
  cropType: 'avatar',
  type: 'avatar',
  onProgress: (progress) => console.log(`${progress}%`)
});
```

#### uploadAvatarWithAutoCrop(file, onProgress?)

智能头像上传（自动裁剪为正方形）

```tsx
const result = await uploadAvatarWithAutoCrop(file, (progress) => {
  console.log(`头像上传: ${progress}%`);
});
```

#### uploadBackgroundWithAutoCrop(file, onProgress?)

智能背景图上传（自动裁剪为16:9）

```tsx
const result = await uploadBackgroundWithAutoCrop(file, (progress) => {
  console.log(`背景图上传: ${progress}%`);
});
```

### 工具函数 API

#### getSuggestedCropArea(file, aspectRatio)

获取建议的裁剪区域

```tsx
import { getSuggestedCropArea } from '@/api';

const cropArea = await getSuggestedCropArea(file, 1); // 1:1 正方形
console.log('建议裁剪区域:', cropArea);
```

#### cropOnly(file, cropArea, config)

仅裁剪图片，不上传

```tsx
import { cropOnly } from '@/api';

const croppedFile = await cropOnly(file, cropArea, {
  outputWidth: 400,
  outputHeight: 400,
  outputQuality: 0.9
});
```

## 🎨 裁剪预设

系统提供了多种预设的裁剪配置：

```tsx
import { CROP_PRESETS } from '@/api';

// 头像 - 1:1 正方形，输出 400x400
CROP_PRESETS.avatar

// 背景图 - 16:9 横向，输出 1920x1080  
CROP_PRESETS.background

// 封面图 - 4:3，输出 800x600
CROP_PRESETS.cover

// 横幅 - 21:9，输出 1260x540
CROP_PRESETS.banner

// 自由裁剪
CROP_PRESETS.free
```

## 🔧 自定义裁剪配置

```tsx
import { ImageCropModal } from '@/components/image-crop';

<ImageCropModal
  isOpen={isOpen}
  imageFile={file}
  cropType="avatar"
  customConfig={{
    outputWidth: 800,
    outputHeight: 800,
    outputQuality: 0.95,
    aspectRatio: 1
  }}
  onCropComplete={handleCropComplete}
  onCancel={handleCancel}
/>
```

## 🎯 使用场景

### 1. 用户头像上传

```tsx
// 在用户设置页面
<AvatarUpload
  currentAvatar={user.avatar}
  onUploadSuccess={(url, key) => {
    updateUserProfile({ avatar: key });
  }}
  size="xl"
/>
```

### 2. 个人资料背景

```tsx
// 在个人资料编辑页面
<BackgroundUpload
  currentBackground={profile.background}
  onUploadSuccess={(url, key) => {
    updateProfile({ background: key });
  }}
  height="250px"
  cropType="background"
/>
```

### 3. 文章封面

```tsx
// 在文章编辑器中
<BackgroundUpload
  currentBackground={article.cover}
  onUploadSuccess={(url, key) => {
    setArticleCover(key);
  }}
  cropType="cover"
  height="180px"
/>
```

### 4. 批量处理

```tsx
import { batchUploadWithCrop } from '@/api';

const handleBatchUpload = async (files: File[], cropAreas: CropArea[]) => {
  const result = await batchUploadWithCrop(files, cropAreas, {
    cropType: 'cover'
  });
  
  console.log(`成功: ${result.success.length}, 失败: ${result.failed.length}`);
};
```

## 🎮 演示页面

访问演示页面查看完整功能：

```tsx
import { CropUploadDemo } from '@/components/image-crop';

function DemoPage() {
  return <CropUploadDemo />;
}
```

演示页面包含：
- 📱 组件化上传示例
- ⚡ API调用示例  
- 🎯 智能裁剪演示
- 🖱️ 手动裁剪演示
- 👁️ 预览功能演示

## 💡 最佳实践

### 1. 头像上传建议

```tsx
// ✅ 推荐：使用组件化方式
<AvatarUpload
  currentAvatar={avatar}
  onUploadSuccess={handleSuccess}
  onUploadError={handleError}
  size="lg"
/>

// ✅ 或者使用API方式
const uploadAvatar = async (file: File) => {
  const result = await uploadAvatarWithAutoCrop(file);
  // 处理结果...
};
```

### 2. 背景图上传建议

```tsx
// ✅ 推荐：指定合适的高度和裁剪类型
<BackgroundUpload
  height="200px"
  cropType="background"
  onUploadSuccess={handleSuccess}
/>
```

### 3. 错误处理

```tsx
const handleUploadError = (error: string) => {
  // 显示用户友好的错误信息
  if (error.includes('格式')) {
    toast.error('请选择JPG或PNG格式的图片');
  } else if (error.includes('大小')) {
    toast.error('图片文件过大，请选择小于5MB的图片');
  } else {
    toast.error('上传失败，请稍后重试');
  }
};
```

### 4. 进度显示

```tsx
const [uploadProgress, setUploadProgress] = useState(0);

const uploadWithProgress = async (file: File) => {
  await uploadAvatarWithAutoCrop(file, (progress) => {
    setUploadProgress(progress);
    // 更新UI进度条
  });
};
```

## ⚠️ 注意事项

1. **文件大小限制**: 头像最大5MB，其他图片最大10MB
2. **支持格式**: JPG、PNG、GIF、WebP
3. **浏览器兼容**: 需要支持Canvas API和File API
4. **OSS配置**: 需要正确配置OSS域名和访问权限
5. **内存使用**: 大图片裁剪可能占用较多内存

## 🔗 相关文档

- [文件上传API文档](../api/README.md)
- [图片处理工具文档](../utils/README.md)
- [组件使用指南](../README.md)

