# 帖子卡片组件系统

## 概述

这是一个支持四种不同帖子类型的卡片组件系统，采用组合式设计模式，将公共功能提取为独立组件，根据帖子类型渲染不同的内容展示。

## 支持的帖子类型

### 1. 文章类型 (ArticlePost)
- 显示文章标题和内容摘要
- 包含全文字数指示器
- 适用于长文章、博客等内容

### 2. 图片类型 (ImagePost) 
- 支持单张图片展示
- 支持多图轮播，包含导航按钮和指示器
- 显示图片计数和错误处理
- 适用于摄影作品、图片分享等

### 3. 视频类型 (VideoPost)
- 显示视频封面和播放按钮
- 包含视频时长和分辨率信息
- 支持点击播放和错误处理
- 适用于教程、娱乐视频等

### 4. 动态类型 (DynamicPost)
- 支持纯文字或图文混合内容
- 采用九宫格布局展示多图
- 最多显示9张图片，超出部分显示"+N"
- 适用于社交动态、生活分享等

## 组件架构

### 公共组件
- **PostHeader**: 用户信息、关注按钮、更多菜单
- **PostTags**: 标签展示，支持展开/收起
- **PostFooter**: 交互按钮（点赞、评论、浏览）和评论区

### 内容组件
- **ArticleContent**: 文章类型内容渲染
- **ImageContent**: 图片类型内容渲染  
- **VideoContent**: 视频类型内容渲染
- **DynamicContent**: 动态类型内容渲染

### 主组件
- **BasePostCard**: 主要的帖子卡片组件，整合所有功能

## 使用方法

```tsx
import { BasePostCard, PostType } from '@/components/post-card';

// 文章类型示例
const articlePost = {
  id: 1,
  type: PostType.ARTICLE,
  title: '文章标题',
  content: '文章摘要...',
  wordCount: 5200,
  // ... 其他公共字段
};

// 使用组件
<BasePostCard
  post={articlePost}
  onLike={handleLike}
  onUserClick={handleUserClick}
  // ... 其他事件处理器
/>
```

## 类型定义

```tsx
// 帖子类型枚举
enum PostType {
  ARTICLE = 'article',
  IMAGE = 'image',
  VIDEO = 'video',
  DYNAMIC = 'dynamic'
}

// 联合类型
type PostItem = ArticlePost | ImagePost | VideoPost | DynamicPost;
```

## 特性

### 响应式设计
- 支持移动端和桌面端适配
- 图片和视频自适应容器大小

### 交互功能
- 点赞/取消点赞
- 评论展开/收起
- 用户关注/取消关注
- 标签点击导航
- 举报和屏蔽功能

### 性能优化
- 图片懒加载和错误处理
- 视频按需加载
- 组件按需渲染

### 可扩展性
- 易于添加新的帖子类型
- 公共功能可复用
- 类型安全的TypeScript支持

## 演示页面

访问 `/demo/post-cards` 查看所有类型的帖子卡片演示。

## 目录结构

```
src/components/post-card/
├── README.md              # 说明文档
├── index.ts              # 主导出文件
├── post.types.ts         # 类型定义
├── BasePostCard.tsx      # 主组件
├── PostHeader.tsx        # 头部组件
├── PostTags.tsx          # 标签组件
├── PostFooter.tsx        # 底部组件
├── FullPostCard.tsx      # 原有的完整组件（保留兼容）
└── content/              # 内容组件目录
    ├── index.ts
    ├── ArticleContent.tsx
    ├── ImageContent.tsx
    ├── VideoContent.tsx
    └── DynamicContent.tsx
``` 