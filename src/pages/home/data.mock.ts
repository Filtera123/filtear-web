// 生成模拟评论的函数

import type { Comment } from '@components/comment/comment.type.ts';
import type { TagItem } from '@components/tag/tag.type.ts';
import { HOME_TABS, type HomeTabs } from '@pages/home/type.ts';
import { v4 as uuidv4 } from 'uuid';
import { PostType, type PostItem } from '@/components';
import { IP_LOCATIONS } from '@/utils/mockData';

const generateMockComments = (postId: string, type: HomeTabs): Comment[] => {
  const commentCount = Math.floor(Math.random() * 12) + 3;
  const userPrefix =
    type === 'subscriptions' ? '订阅用户' : type === 'following' ? '关注用户' : '推荐用户';

  const ipLocations = IP_LOCATIONS;
  
  return Array.from({ length: commentCount }, (_, i) => {
    const comment: Comment = {
      id: `comment-${postId}-${i}`,
      userId: `user${(i % 4) + 1}`,
      userName: `${userPrefix}${(i % 4) + 1}`,
      userAvatar: '/default-avatar.png',
      userIpLocation: ipLocations[i % ipLocations.length],
      content:
        type === 'subscriptions'
          ? `精彩内容！第 ${i + 1} 条评论：订阅你的频道真是太值得了。`
          : type === 'following'
            ? `很棒的分享！第 ${i + 1} 条评论：一直关注你的内容。`
            : `很有深度的内容！第 ${i + 1} 条评论：这个话题让我想到了很多。`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      likes: Math.floor(Math.random() * 25),
      isLiked: Math.random() > 0.8,
      replies:
        Math.random() > 0.6
          ? [
              {
                id: `reply-${postId}-${i}-1`,
                userId: `user${((i + 1) % 4) + 1}`,
                userName: `回复用户${((i + 1) % 4) + 1}`,
                userAvatar: '/default-avatar.png',
                userIpLocation: ipLocations[(i + 1) % ipLocations.length],
                content: `回复评论 ${i + 1} 的内容...`,
                createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                likes: Math.floor(Math.random() * 5),
                isLiked: false,
              },
            ]
          : undefined,
    };
    return comment;
  });
};

// 生成模拟标签的函数
const generateMockTags = (postId: number, type: HomeTabs): TagItem[] => {
  const tagSets = {
    recommended: ['推荐', '热门', '讨论', '分享', '技术', '生活', '学习', '工作', '娱乐', '游戏'],
    subscriptions: [
      '订阅',
      '优质内容',
      '专业',
      '原创',
      '深度解析',
      '实战经验',
      '行业动态',
      '技术前沿',
    ],
    following: ['关注', '专业', '深度', '原创', '实用', '经验分享', '技术', '生活', '学习', '职场'],
  };

  const allTags = [
    ...tagSets[type],
    '创新思维',
    '效率提升',
    '思考总结',
    '案例分析',
    '趋势观察',
    '方法论',
    '最佳实践',
    '干货分享',
  ];

  let tagCount = Math.floor(Math.random() * 5) + 3; // 3-7个标签
  if (postId % 4 === 0) {
    tagCount = Math.floor(Math.random() * 6) + 8; // 8-13个标签
  }

  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  // return shuffled.slice(0, tagCount);
  return shuffled.slice(0, tagCount).map((tag) => ({
    id: uuidv4(),
    name: tag,
    isPopular: Math.random() > 0.9, // 随机决定是否为热门标签
  }));
};

const allImageUrls = [
  'https://plus.unsplash.com/premium_photo-1751358174687-88a777c6a194?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 横向
  'https://images.unsplash.com/photo-1742201587774-f44fe79556f9?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 纵向
  'https://images.unsplash.com/photo-1743376272672-c130603a3af2?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 方形
  'https://plus.unsplash.com/premium_photo-1751442185664-0c84da01a4ff?q=80&w=2555&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1751420860835-68256ba0f82a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1750729058168-9cc8090ae2ec?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1749476695941-e03f73d3c7e7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1747851401070-079887211e64?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1751220418652-1c10d9616227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

// 生成模拟帖子数据
const generateMockPosts = (count: number, type: HomeTabs): PostItem[] => {
  const postTypes = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC];

  const authorSets = {
    [HOME_TABS.Recommended]: [
      '技术博主小王',
      '摄影师李梅',
      'UP主小明',
      '旅行达人小张',
      '美食爱好者小红',
    ],
    [HOME_TABS.Subscriptions]: [
      '知识博主王老师',
      '设计师李小姐',
      '技术UP主小明',
      '生活达人张姐',
      '创业导师陈总',
    ],
    [HOME_TABS.Following]: [
      '技术大牛老王',
      '设计师小李',
      '创业者张总',
      '产品经理小美',
      '摄影师老陈',
    ],
  };

  const categorySets = {
    [HOME_TABS.Recommended]: ['前端技术', '摄影作品', '生活技能', '生活分享', '美食'],
    [HOME_TABS.Subscriptions]: ['知识分享', '设计灵感', '技术教程', '生活美学', '创业心得'],
    [HOME_TABS.Following]: ['技术分享', '设计作品', '创业心得', '产品思考', '摄影教程'],
  };

  const authors = authorSets[type];
  const categories = categorySets[type];

  return Array.from({ length: count }).map((_, i): PostItem => {
    const id = uuidv4(); // 使用时间戳加上索引作为唯一ID
    const commentList = generateMockComments(id, type);
    const tags = generateMockTags(i, type);
    const typeIndex = i % 4;
    const postType = postTypes[typeIndex];
    const author = authors[i % authors.length];
    const category = categories[i % categories.length];

    const authorIpLocations = IP_LOCATIONS;
    
    const basePost = {
      id,
      author,
      authorAvatar: `https://avatars.githubusercontent.com/u/${i + (type === 'subscriptions' ? 2000 : type === 'following' ? 1000 : 0)}?v=4`,
      authorIpLocation: authorIpLocations[i % authorIpLocations.length],
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `${type}-post-${id}`,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      tags,
      isLike: Math.random() > 0.6,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: commentList.length,
      commentList,
      views: Math.floor(Math.random() * 1000) + 100,
      isFollowing: type === 'following' ? true : Math.random() > 0.5,
    };

    // 根据类型生成不同的内容
    switch (postType) {
      case PostType.ARTICLE:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `${i % 3 === 0 ? '技术深度解析' : i % 3 === 1 ? '实战经验总结' : '行业趋势观察'} - 第 ${i + 1} 篇`,
          abstract: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
无人爱苦，亦无人寻之欲之，乃因其苦`,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce molestie elit ac ante ultrices pellentesque. Sed nec sapien sed dolor porttitor aliquam a ac nisi. Nullam vestibulum dui eu luctus lacinia. Nam eu congue elit. Sed condimentum neque nisi, quis fringilla urna viverra non. Cras scelerisque, odio at rutrum aliquam, ante metus placerat lectus, ut tempor libero ante in dui. Phasellus pulvinar malesuada libero, vitae vehicula mauris luctus eget. Proin cursus condimentum varius. Morbi eros libero, pulvinar eget volutpat et, eleifend nec neque.
Suspendisse nec vehicula justo. In a mauris ultricies, laoreet eros at, fermentum dui. Aenean consectetur feugiat elit ut tristique. Maecenas id neque id lacus dictum luctus. Integer ac libero auctor, consequat dui non, mattis erat. Mauris sagittis ligula nec eros viverra mattis. Donec cursus, felis eu ullamcorper sagittis, risus est lobortis mi, et imperdiet nisi nunc ac augue. Ut scelerisque lectus leo, nec malesuada elit fermentum a. Sed venenatis lorem tortor, id tempor lectus ultrices ac. Vivamus sem nisl, convallis eu rutrum sed, iaculis tempor mauris.`,
          wordCount: Math.floor(Math.random() * 8000) + 3000,
        };

      case PostType.IMAGE:
        const imageCount = Math.floor(Math.random() * 20) + 1;
        return {
          ...basePost,
          type: PostType.IMAGE,
          title: `${i % 2 === 0 ? '创意设计展示' : '摄影作品分享'} - 第 ${i + 1} 组`,

          content: `分享一组精心创作的作品，希望能够带给大家视觉上的享受和创作灵感。`,
          images: Array.from({ length: imageCount }, (_, imgIndex) => ({
            url: allImageUrls[imgIndex % allImageUrls.length],
            alt: `作品 ${imgIndex + 1}`,
            width: 800,
            height: 600,
          })),
        };

      case PostType.VIDEO:
        return {
          ...basePost,
          type: PostType.VIDEO,
          title: `${i % 2 === 0 ? '实用技巧分享' : '深度知识讲解'} - 第 ${i + 1} 期`,
          content: `本期视频为大家带来${Math.floor(Math.random() * 20) + 10}分钟的精彩内容，希望对大家的学习和工作有所帮助。`,
          video: {
            url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${1200 + (i % 4)}x${800 + (i % 2) * 100}_2mb.mp4`,
            thumbnail: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=800&auto=format`,
            duration: Math.floor(Math.random() * 1200) + 600,
            width: 1280,
            height: 720,
          },
        };

      case PostType.DYNAMIC:
        const dynamicImageCount = Math.floor(Math.random() * 4) + 1;
        return {
          ...basePost,
          type: PostType.DYNAMIC,
          title: `${i % 3 === 0 ? '工作日常' : i % 3 === 1 ? '学习心得' : '生活感悟'} ✨`,
          content: `记录日常生活中的美好瞬间，分享一些工作和学习的心得体会。生活就是要在这些小小的瞬间中找到快乐 🌟`,
          images:
            dynamicImageCount > 0
              ? Array.from({ length: dynamicImageCount }, (_, imgIndex) => ({
                  url: allImageUrls[imgIndex % allImageUrls.length],
                  alt: `日常分享 ${imgIndex + 1}`,
                }))
              : undefined,
        };

      default:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `${author}的分享 ${i + 1}`,
          content: '默认内容',
          wordCount: 3000,
        };
    }
  });
};

const generateTweets = (page: number, type: HomeTabs): PostItem[] => {
  return generateMockPosts(page, type);
};

interface TweetsResponse {
  list: PostItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// 模拟 API 调用
export const fetchTweets = async (
  tab: HomeTabs,
  pageParam: number = 0
): Promise<TweetsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const page = pageParam;
  const tweets = generateTweets(page, tab);

  return {
    list: tweets,
    page: page,
    pageSize: 10,
    total: 100, // 模拟总数据量
    hasMore: page < 10, // 模拟最多 10 页数据
  };
};
