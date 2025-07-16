# 举报系统使用指南

本文档介绍如何在应用程序中使用举报系统。

## 组件结构

举报系统由以下部分组成：

1. `ReportModal` - 弹窗组件，包含一级和二级表单
2. `ReportContext` - 全局上下文，使举报功能在任何组件中可用
3. `useReportModal` - 钩子函数，管理举报弹窗的状态

## 使用方法

### 1. 在组件中使用

```tsx
import { useReportContext } from '@/components/report';

function MyComponent() {
  const { openReportModal } = useReportContext();
  
  const handleReportClick = () => {
    // 打开举报弹窗，参数为：内容ID，内容类型，用户ID（可选）
    openReportModal('123', 'post', 'user456');
  };
  
  return (
    <button onClick={handleReportClick}>举报</button>
  );
}
```

### 2. 举报内容类型

系统支持三种内容类型的举报：
- `post` - 举报帖子
- `comment` - 举报评论
- `user` - 举报用户

### 3. 举报分类

举报系统实现了以下分类：
- 创作者权益保护（抄袭/无授权翻译/洗稿）
- AI稿件专属通道
- 图层权益保护
- 违法违规举报
- 其它

### 4. 自定义举报表单

可以在 `ReportModal.tsx` 文件中修改或添加举报表单，每种举报类型可以有不同的表单字段。

## 实现说明

1. 用户点击"举报"按钮时，会打开一级举报分类选择弹窗
2. 选择一级分类后，会进入相应的二级表单页面
3. 用户填写表单并提交后，数据会发送到后端处理

## API集成

目前系统使用 `console.log` 记录举报数据。在实际应用中，应该将其替换为 API 调用，向后端发送举报数据。 