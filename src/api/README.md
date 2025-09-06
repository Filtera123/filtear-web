# 文件上传API接口文档

本模块提供了完整的文件上传下载功能，包括图片压缩、文件验证、批量上传等功能。

## 功能特性

- ✅ 单文件/批量文件上传
- ✅ 图片自动压缩优化
- ✅ 文件类型和大小验证
- ✅ 上传进度监控
- ✅ 头像专用上传处理
- ✅ 视频文件上传和缩略图生成
- ✅ 文件下载链接获取
- ✅ TypeScript完整类型支持

## 快速开始

### 基础上传

```typescript
import { uploadFile, uploadAvatar } from '@/api';

// 上传普通文件
const result = await uploadFile(file, {
  type: 'post-image',
  compress: true,
  onProgress: (progress) => console.log(`${progress}%`)
});

// 上传头像
const avatarResult = await uploadAvatar(file, (progress) => {
  console.log(`头像上传: ${progress}%`);
});
```

### 使用上传器

```typescript
import { createImageUploader, createVideoUploader } from '@/api';

// 图片上传器
const imageUploader = createImageUploader({
  compress: true,
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080
});

await imageUploader.uploadPostImage(file);

// 视频上传器
const videoUploader = createVideoUploader();
const videoInfo = await videoUploader.getVideoInfo(file);
const thumbnail = await videoUploader.createVideoThumbnail(file);
```

## API参考

### 核心函数

#### `uploadFile(file, options)`

上传单个文件

**参数:**
- `file: File` - 要上传的文件
- `options: FileUploadOptions` - 上传选项

**返回:** `Promise<BaseApiResponse<FileUploadResponse>>`

**选项:**
```typescript
interface FileUploadOptions {
  type?: 'avatar' | 'post-image' | 'video' | 'attachment';
  compress?: boolean;
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  onProgress?: (progress: number) => void;
}
```

#### `uploadFiles(files, options)`

批量上传文件

**参数:**
- `files: File[]` - 文件列表
- `options: FileUploadOptions` - 上传选项

**返回:** `Promise<BatchUploadResult>`

#### `downloadFile(fileName)`

获取文件下载链接

**参数:**
- `fileName: string` - 文件在OSS中的key

**返回:** `Promise<BaseApiResponse<FileDownloadResponse>>`

### 工具函数

#### `validateFile(file, type)`

验证文件是否符合要求

```typescript
const validation = validateFile(file, 'avatar');
if (!validation.valid) {
  console.error(validation.error);
}
```

#### `compressImage(file, options)`

压缩图片文件

```typescript
const compressedFile = await compressImage(file, {
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024
});
```

#### `formatFileSize(bytes)`

格式化文件大小显示

```typescript
console.log(formatFileSize(1048576)); // "1.0 MB"
```

### 上传器工厂

#### `createImageUploader(options)`

创建图片专用上传器

```typescript
const uploader = createImageUploader({
  compress: true,
  quality: 0.8
});

// 上传头像
await uploader.uploadAvatar(file);

// 上传帖子图片
await uploader.uploadPostImage(file);

// 创建预览
const previewUrl = await uploader.createImagePreview(file);
```

#### `createVideoUploader(options)`

创建视频专用上传器

```typescript
const uploader = createVideoUploader();

// 获取视频信息
const info = await uploader.getVideoInfo(file);

// 生成缩略图
const thumbnail = await uploader.createVideoThumbnail(file);

// 上传视频
await uploader.uploadVideo(file);
```

#### `createBatchUploader(options)`

创建批量上传器

```typescript
const uploader = createBatchUploader({
  type: 'post-image'
});

// 过滤有效文件
const validFiles = uploader.filterValid(files);

// 创建预览
const previews = await uploader.createPreviews(validFiles);

// 逐个上传
const result = await uploader.uploadSequentially(
  validFiles,
  {},
  (index, file, progress) => console.log(`${file.name}: ${progress}%`),
  (index, file, result) => console.log(`${file.name} 完成`)
);
```

## 文件类型配置

支持的文件类型和限制：

| 类型 | 格式 | 大小限制 | 说明 |
|------|------|----------|------|
| avatar | JPG, PNG | 5MB | 头像图片，会自动压缩 |
| post-image | JPG, PNG, GIF, WebP | 10MB | 帖子图片，支持压缩 |
| video | MP4, AVI, MOV, WMV | 100MB | 视频文件 |
| attachment | PDF, DOC, XLS等 | 20MB | 附件文件 |

## React Hook 使用

```typescript
import { useFileUpload } from '@/api/examples';

function UploadComponent() {
  const { upload, isUploading, progress, error, reset } = useFileUpload();

  const handleFileSelect = async (file: File) => {
    const result = await upload(file, { type: 'avatar' });
    if (result) {
      console.log('上传成功:', result.key);
    }
  };

  return (
    <div>
      {isUploading && <div>上传中: {progress}%</div>}
      {error && <div>错误: {error}</div>}
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
}
```

## 错误处理

所有API调用都返回统一的响应格式：

```typescript
interface BaseApiResponse<T> {
  code: number;    // 200=成功, 其他=失败
  message: string; // 响应消息
  data?: T;        // 响应数据
}
```

常见错误码：
- `200`: 成功
- `400`: 参数错误（文件格式、大小等）
- `404`: 文件不存在
- `500`: 服务器错误

## 高级用法

### 自定义图片压缩

```typescript
import { compressImage } from '@/api';

const compressedFile = await compressImage(file, {
  quality: 0.5,        // 压缩质量
  maxWidth: 800,       // 最大宽度
  maxHeight: 600,      // 最大高度
  outputFormat: 'jpeg' // 输出格式
});
```

### 文件预览

```typescript
import { createFilePreview } from '@/api';

const previewUrl = await createFilePreview(imageFile);
// 可以用于 <img src={previewUrl} />
```

### 批量处理

```typescript
import { validateFiles, filterValidFiles } from '@/api';

// 批量验证
const results = validateFiles(files, 'post-image');
results.forEach(({ file, validation }) => {
  if (!validation.valid) {
    console.log(`${file.name}: ${validation.error}`);
  }
});

// 过滤有效文件
const validFiles = filterValidFiles(files, 'post-image');
```

## 注意事项

1. **开发环境**: 自动使用模拟API，无需后端支持
2. **生产环境**: 需要配置真实的后端API地址
3. **图片压缩**: 大图片会自动压缩，可通过选项控制
4. **进度监控**: 支持实时上传进度回调
5. **文件验证**: 自动验证文件类型和大小
6. **错误处理**: 统一的错误响应格式

## 与后端集成

在生产环境中，需要确保：

1. 后端API接口遵循文档规范
2. 正确配置CORS和认证
3. OSS服务正确配置防盗链
4. 设置合适的文件大小限制

更多使用示例请参考 `src/api/examples.ts` 文件。
