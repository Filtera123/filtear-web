import { PostType, type PostItem } from '@/components/post-card/post.types';

// 文章类型帖子
export const mockArticlePost: PostItem = {
  id: 1,
  type: PostType.ARTICLE,
  author: '技术博主小王',
  authorAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  slug: 'react-best-practices',
  category: '前端技术',
  categorySlug: 'frontend',
  title: 'React 最佳实践：构建可维护的现代应用',
  content: 'React 作为目前最流行的前端框架之一，在企业级应用开发中扮演着重要角色。本文将分享一些在实际项目中总结的最佳实践，包括组件设计模式、状态管理、性能优化等方面的经验...',
  wordCount: 6800,
  tags: ['React', 'JavaScript', '前端开发', '最佳实践', '性能优化'],
  isLike: false,
  likes: 156,
  comments: 23,
  views: 1250,
  isFollowing: false,
  commentList: []
};

// 图片类型帖子
export const mockImagePost: PostItem = {
  id: 2,
  type: PostType.IMAGE,
  author: '摄影师李梅',
  authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
  createdAt: '2024-01-16T14:20:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
  slug: 'nature-photography',
  category: '摄影作品',
  categorySlug: 'photography',
  title: '晨光中的森林小径',
  content: '清晨的第一缕阳光穿过树叶间隙，洒在蜿蜒的小径上，形成了美丽的光影效果。这张照片拍摄于黄山脚下的竹林中。',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      alt: '森林小径',
      width: 800,
      height: 600
    },
    {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
      alt: '阳光穿透',
      width: 800,
      height: 600
    },
    {
      url: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800',
      alt: '竹林光影',
      width: 800,
      height: 600
    }
  ],
  tags: ['摄影', '自然', '风景', '黄山', '光影'],
  isLike: true,
  likes: 89,
  comments: 12,
  views: 456,
  isFollowing: true,
  commentList: []
};

// 视频类型帖子
export const mockVideoPost: PostItem = {
  id: 3,
  type: PostType.VIDEO,
  author: 'UP主小明',
  authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
  createdAt: '2024-01-17T16:45:00Z',
  updatedAt: '2024-01-17T16:45:00Z',
  slug: 'cooking-tutorial',
  category: '生活技能',
  categorySlug: 'lifestyle',
  title: '10分钟学会制作正宗意大利面',
  content: '简单易学的意大利面制作教程，包含选材、调味、烹饪技巧等详细步骤。即使是厨房新手也能轻松掌握！',
  video: {
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800',
    duration: 635, // 10分35秒
    width: 1280,
    height: 720
  },
  tags: ['烹饪', '意大利面', '教程', '美食', '生活技能'],
  isLike: false,
  likes: 234,
  comments: 45,
  views: 2150,
  isFollowing: false,
  commentList: []
};

// 动态类型帖子
export const mockDynamicPost: PostItem = {
  id: 4,
  type: PostType.DYNAMIC,
  author: '旅行达人小张',
  authorAvatar: 'https://avatars.githubusercontent.com/u/4?v=4',
  createdAt: '2024-01-18T09:15:00Z',
  updatedAt: '2024-01-18T09:15:00Z',
  slug: 'travel-moment',
  category: '生活分享',
  categorySlug: 'lifestyle',
  title: '今天的西湖真美！',
  content: '阳光正好，微风不燥，和朋友们一起在西湖边走走停停，感受这座城市的温柔。生活就是要偶尔慢下来，享受当下的美好时光 ✨',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      alt: '西湖美景'
    },
    {
      url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400',
      alt: '湖边小径'
    },
    {
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
      alt: '古典建筑'
    },
    {
      url: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400',
      alt: '荷花池'
    }
  ],
  tags: ['旅行', '西湖', '杭州', '生活', '美景'],
  isLike: false,
  likes: 67,
  comments: 8,
  views: 312,
  isFollowing: false,
  commentList: []
};

// 导出所有模拟数据
export const mockPosts: PostItem[] = [
  mockArticlePost,
  mockImagePost,
  mockVideoPost,
  mockDynamicPost
];

// 按类型导出
export const mockPostsByType = {
  [PostType.ARTICLE]: [mockArticlePost],
  [PostType.IMAGE]: [mockImagePost],
  [PostType.VIDEO]: [mockVideoPost],
  [PostType.DYNAMIC]: [mockDynamicPost]
}; 