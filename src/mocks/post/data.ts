import { PostType, type PostItem } from '@/components/post-card/post.types';

// 文章类型帖子（带引言）
export const mockArticlePost: PostItem = {
  id: '1',
  type: PostType.ARTICLE,
  author: '技术博主小王',
  authorId: 'xiaowang',
  authorAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  authorIpLocation: '北京',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  slug: 'react-best-practices',
  category: '前端技术',
  categorySlug: 'frontend',
  title: 'React 最佳实践：构建可维护的现代应用',
  abstract: '本文总结了在企业级React项目中的实战经验，涵盖组件设计、状态管理、性能优化等核心主题，帮助开发者构建更加健壮和可维护的现代前端应用。',
  content: 'React 作为目前最流行的前端框架之一，在企业级应用开发中扮演着重要角色。本文将分享一些在实际项目中总结的最佳实践，包括组件设计模式、状态管理、性能优化等方面的经验。\n\n在组件设计方面，我们应该遵循单一职责原则，确保每个组件只负责一个特定的功能。同时，合理使用Props和State，避免不必要的重渲染。\n\n状态管理是React应用的核心，选择合适的状态管理方案对项目的可维护性至关重要。对于简单的应用，使用Context API就足够了，而复杂的应用则需要考虑使用Redux或Zustand等专业的状态管理库。\n\n性能优化也是不可忽视的一环，通过合理使用React.memo、useMemo、useCallback等优化手段，可以显著提升应用的性能表现...',
  wordCount: 6800,
  tags: [
    { id: '1', name: 'React' },
    { id: '2', name: 'JavaScript' },
    { id: '3', name: '前端开发' },
    { id: '4', name: '最佳实践' },
    { id: '5', name: '性能优化' }
  ],
  isLike: false,
  likes: 156,
  comments: 23,
  views: 1250,
  isFollowing: false,
  commentList: []
};

// 文章类型帖子（无引言）
export const mockArticlePostNoAbstract: PostItem = {
  id: '5',
  type: PostType.ARTICLE,
  author: '程序员老李',
  authorId: 'laoli',
  authorAvatar: 'https://avatars.githubusercontent.com/u/5?v=4',
  authorIpLocation: '上海',
  createdAt: '2024-01-20T08:30:00Z',
  updatedAt: '2024-01-20T08:30:00Z',
  slug: 'typescript-advanced',
  category: '前端技术',
  categorySlug: 'frontend',
  title: 'TypeScript 高级技巧与实践',
  content: 'TypeScript 已经成为现代前端开发的标配工具。在这篇文章中，我将分享一些高级的TypeScript使用技巧和实践经验。\n\n首先，我们来了解一下条件类型的强大之处。条件类型允许我们基于类型检查来选择不同的类型分支，这在构建类型安全的API时非常有用。\n\n其次，映射类型可以帮助我们基于已有类型创建新的类型，大大提高了代码的可复用性和类型安全性。\n\n最后，我们还将探讨模块声明、装饰器等高级特性的使用场景和最佳实践...',
  wordCount: 4200,
  tags: [
    { id: '6', name: 'TypeScript' },
    { id: '7', name: 'JavaScript' },
    { id: '8', name: '类型系统' },
    { id: '9', name: '高级技巧' }
  ],
  isLike: true,
  likes: 98,
  comments: 15,
  views: 887,
  isFollowing: false,
  commentList: []
};

// 单张图片帖子
export const mockSingleImagePost: PostItem = {
  id: '6',
  type: PostType.IMAGE,
  author: '摄影师小陈',
  authorId: 'xiaochen',
  authorAvatar: 'https://avatars.githubusercontent.com/u/6?v=4',
  authorIpLocation: '广东',
  createdAt: '2024-01-19T14:20:00Z',
  updatedAt: '2024-01-19T14:20:00Z',
  slug: 'sunset-photography',
  category: '摄影作品',
  categorySlug: 'photography',
  title: '海边日落时分',
  content: '在海边等待了两个小时，终于捕捉到了这个完美的日落瞬间。海浪轻抚着岸边，天空被染成了金橙色。',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: '海边日落',
      width: 800,
      height: 600
    }
  ],
  tags: [
    { id: '10', name: '摄影' },
    { id: '11', name: '日落' },
    { id: '12', name: '海边' },
    { id: '13', name: '风景' }
  ],
  isLike: false,
  likes: 124,
  comments: 18,
  views: 678,
  isFollowing: true,
  commentList: []
};

// 图片类型帖子（多张图片，测试9宫格+剩余数量）
export const mockImagePost: PostItem = {
  id: '2',
  type: PostType.IMAGE,
  author: '摄影师李梅',
  authorId: 'limei',
  authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
  authorIpLocation: '江苏',
  createdAt: '2024-01-16T14:20:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
  slug: 'nature-photography',
  category: '摄影作品',
  categorySlug: 'photography',
  title: '春天的花园摄影集',
  content: '春天来了，花园里百花盛开。用镜头记录下这些美丽的瞬间，与大家分享春天的美好。',
  images: [
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', alt: '樱花' },
    { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400', alt: '桃花' },
    { url: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400', alt: '杏花' },
    { url: 'https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?w=400', alt: '玫瑰' },
    { url: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=400', alt: '郁金香' },
    { url: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=400', alt: '向日葵' },
    { url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400', alt: '薰衣草' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', alt: '百合' },
    { url: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400', alt: '雏菊' },
    { url: 'https://images.unsplash.com/photo-1469259943454-aa100abba749?w=400', alt: '牡丹' },
    { url: 'https://images.unsplash.com/photo-1571920267507-e3e76c2bb5f7?w=400', alt: '茉莉' },
    { url: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=400', alt: '兰花' }
  ],
  tags: [
    { id: '14', name: '摄影' },
    { id: '15', name: '花卉' },
    { id: '16', name: '春天' },
    { id: '17', name: '自然' },
    { id: '18', name: '花园' }
  ],
  isLike: true,
  likes: 189,
  comments: 32,
  views: 1156,
  isFollowing: true,
  commentList: []
};

// 四张图片帖子（测试田字格布局）
export const mockFourImagePost: PostItem = {
  id: '7',
  type: PostType.IMAGE,
  author: '旅行摄影师',
  authorId: 'traveler',
  authorAvatar: 'https://avatars.githubusercontent.com/u/7?v=4',
  authorIpLocation: '浙江',
  createdAt: '2024-01-21T11:30:00Z',
  updatedAt: '2024-01-21T11:30:00Z',
  slug: 'city-views',
  category: '摄影作品',
  categorySlug: 'photography',
  title: '城市的四个角度',
  content: '从不同的角度看这座城市，每一个视角都有独特的美。',
  images: [
    { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400', alt: '城市天际线' },
    { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400', alt: '街道景观' },
    { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400', alt: '建筑细节' },
    { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', alt: '夜景灯光' }
  ],
  tags: [
    { id: '19', name: '城市' },
    { id: '20', name: '建筑' },
    { id: '21', name: '摄影' },
    { id: '22', name: '风景' }
  ],
  isLike: false,
  likes: 76,
  comments: 9,
  views: 432,
  isFollowing: false,
  commentList: []
};

// 视频类型帖子
export const mockVideoPost: PostItem = {
  id: '3',
  type: PostType.VIDEO,
  author: 'UP主小明',
  authorId: 'xiaoming',
  authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
  authorIpLocation: '美国',
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
  tags: [
    { id: '23', name: '烹饪' },
    { id: '24', name: '意大利面' },
    { id: '25', name: '教程' },
    { id: '26', name: '美食' },
    { id: '27', name: '生活技能' }
  ],
  isLike: false,
  likes: 234,
  comments: 45,
  views: 2150,
  isFollowing: false,
  commentList: []
};

// 纯文字动态
export const mockTextDynamicPost: PostItem = {
  id: '8',
  type: PostType.DYNAMIC,
  author: '思考者小王',
  authorId: 'thinker',
  authorAvatar: 'https://avatars.githubusercontent.com/u/8?v=4',
  authorIpLocation: '湖北',
  createdAt: '2024-01-22T16:20:00Z',
  updatedAt: '2024-01-22T16:20:00Z',
  slug: 'life-thoughts',
  category: '生活感悟',
  categorySlug: 'thoughts',
  title: '关于成长的一些思考',
  content: '最近在思考成长这个话题。成长不仅仅是年龄的增长，更是心智的成熟和视野的开阔。\n\n每个人的成长轨迹都不相同，有的人早慧，有的人大器晚成。重要的是保持好奇心和学习的热情。\n\n在这个快节奏的时代，我们容易被各种信息和压力包围，但真正的成长往往发生在安静的时刻，当我们停下来反思和沉淀的时候。\n\n愿我们都能在各自的道路上，以自己的节奏，慢慢成长，慢慢变好。\n\n#成长 #思考 #生活感悟',
  tags: [
    { id: '28', name: '成长' },
    { id: '29', name: '思考' },
    { id: '30', name: '生活' },
    { id: '31', name: '感悟' },
    { id: '32', name: '心理' }
  ],
  isLike: true,
  likes: 45,
  comments: 12,
  views: 234,
  isFollowing: false,
  commentList: []
};

// 带图片的动态
export const mockDynamicPost: PostItem = {
  id: '4',
  type: PostType.DYNAMIC,
  author: '旅行达人小张',
  authorId: 'xiaozhang',
  authorAvatar: 'https://avatars.githubusercontent.com/u/4?v=4',
  authorIpLocation: '浙江',
  createdAt: '2024-01-18T09:15:00Z',
  updatedAt: '2024-01-18T09:15:00Z',
  slug: 'travel-moment',
  category: '生活分享',
  categorySlug: 'lifestyle',
  title: '今天的西湖真美！',
  content: '阳光正好，微风不燥，和朋友们一起在西湖边走走停停，感受这座城市的温柔。生活就是要偶尔慢下来，享受当下的美好时光 ✨',
  images: [
    { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', alt: '西湖美景' },
    { url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400', alt: '湖边小径' },
    { url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400', alt: '古典建筑' },
    { url: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400', alt: '荷花池' },
    { url: 'https://images.unsplash.com/photo-1567073049833-5b9a0b9ff7e9?w=400', alt: '柳树成荫' },
    { url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19d?w=400', alt: '湖心亭' }
  ],
  tags: [
    { id: '33', name: '旅行' },
    { id: '34', name: '西湖' },
    { id: '35', name: '杭州' },
    { id: '36', name: '生活' },
    { id: '37', name: '美景' }
  ],
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
  mockArticlePostNoAbstract,
  mockSingleImagePost,
  mockImagePost,
  mockFourImagePost,
  mockVideoPost,
  mockTextDynamicPost,
  mockDynamicPost
];

// 按类型导出
export const mockPostsByType = {
  [PostType.ARTICLE]: [mockArticlePost, mockArticlePostNoAbstract],
  [PostType.IMAGE]: [mockSingleImagePost, mockImagePost, mockFourImagePost],
  [PostType.VIDEO]: [mockVideoPost],
  [PostType.DYNAMIC]: [mockTextDynamicPost, mockDynamicPost]
}; 