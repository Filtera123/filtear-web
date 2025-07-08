import { type Comment } from '../comment/comment.type';

// 帖子类型常量
export const PostType = {
  ARTICLE: 'article',    // 文章
  IMAGE: 'image',        // 图片
  VIDEO: 'video',        // 视频
  DYNAMIC: 'dynamic'     // 动态
} as const;

export type PostTypeValue = typeof PostType[keyof typeof PostType];

// 基础帖子接口
export interface BasePost {
  id: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  tags: string[];
  isLike: boolean;
  likes: number;
  comments: number;
  commentList?: Comment[];
  views?: number;
  isFollowing?: boolean;
  type: PostTypeValue;  // 新增帖子类型字段
}

// 文章类型帖子
export interface ArticlePost extends BasePost {
  type: typeof PostType.ARTICLE;
  content: string;
  abstract?: string;  // 新增：文章引言/摘要
  wordCount: number;  // 文章全文字数
}

// 图片类型帖子
export interface ImagePost extends BasePost {
  type: typeof PostType.IMAGE;
  content: string;  // 图片描述
  images: Array<{
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;  // 最多20张图片
}

// 视频类型帖子
export interface VideoPost extends BasePost {
  type: typeof PostType.VIDEO;
  content: string;  // 视频描述
  video: {
    url: string;
    thumbnail: string;
    duration: number;  // 视频时长（秒）
    width?: number;
    height?: number;
  };
}

// 动态类型帖子
export interface DynamicPost extends BasePost {
  type: typeof PostType.DYNAMIC;
  content: string;  // 动态内容
  images?: Array<{
    url: string;
    alt?: string;
  }>;  // 可选的配图
}

// 联合类型
export type PostItem = ArticlePost | ImagePost | VideoPost | DynamicPost;

// 帖子列表类型
export type PostListType = 'recommended' | 'subscriptions' | 'following';

// 帖子卡片组件的通用Props
export interface PostCardProps {
  post: PostItem;
  onFollow?: (userId: string) => void;
  onLike?: (postId: number) => void;
  onUserClick?: (userId: string) => void;
  onPostClick?: (postId: number) => void;
  onTagClick?: (tag: string) => void;
  onReport?: (postId: number, type: 'post' | 'user') => void;
  onBlock?: (postId: number, type: 'post' | 'user') => void;
  onUnfollow?: (userId: string) => void;
  onAddComment?: (postId: number, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onBlockComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  onBlockUser?: (userId: string) => void;
  onHeightChange?: () => void; // 新增：当帖子高度发生变化时的回调
} 