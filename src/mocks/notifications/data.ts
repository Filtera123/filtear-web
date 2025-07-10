export interface NotificationUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface NotificationPost {
  id: string;
  type: 'article' | 'image' | 'video' | 'dynamic';
  title?: string;
  content?: string;
  image?: string;
}

export interface BaseNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  user?: NotificationUser;
  post?: NotificationPost;
  content?: string;
  createdAt: string;
  isRead: boolean;
}

export const mockNotifications: BaseNotification[] = [
  // 喜欢通知
  {
    id: '1',
    type: 'like',
    user: { 
      id: 'user1', 
      name: '张三', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post1', 
      type: 'article', 
      title: '深入理解React Hooks的原理与实践',
      content: '本文详细介绍了React Hooks的工作原理，包括useState、useEffect等常用hooks的内部实现机制...',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=64&h=64&fit=crop'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5分钟前
    isRead: false,
  },
  {
    id: '2',
    type: 'like',
    user: { 
      id: 'user2', 
      name: '李四', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post2', 
      type: 'image', 
      content: '今天拍摄的美丽日落，色彩层次丰富，令人陶醉',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=64&h=64&fit=crop'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45分钟前
    isRead: false,
  },
  {
    id: '3',
    type: 'like',
    user: { 
      id: 'user3', 
      name: '王五', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post3', 
      type: 'video', 
      title: '前端开发技巧分享',
      content: '分享一些实用的前端开发技巧和最佳实践',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=64&h=64&fit=crop'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3小时前
    isRead: true,
  },
  
  // 评论通知
  {
    id: '4',
    type: 'comment',
    user: { 
      id: 'user4', 
      name: '赵六', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post4', 
      type: 'article', 
      title: 'TypeScript高级技巧总结',
      content: '总结了TypeScript中的一些高级类型操作和实用技巧...',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=64&h=64&fit=crop'
    },
    content: '写得非常详细，特别是关于泛型约束的部分很有帮助！',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    isRead: false,
  },
  {
    id: '5',
    type: 'comment',
    user: { 
      id: 'user5', 
      name: '孙七', 
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post5', 
      type: 'dynamic', 
      content: '今天学到了一个新的CSS技巧，分享给大家！'
    },
    content: '请问可以分享一下具体的代码示例吗？',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
    isRead: false,
  },
  {
    id: '6',
    type: 'comment',
    user: { 
      id: 'user6', 
      name: '周八', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    post: { 
      id: 'post6', 
      type: 'image', 
      content: '北京雨后的天空，云层变化多端',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=64&h=64&fit=crop'
    },
    content: '这个角度拍得真好，云层的层次感很棒！',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6小时前
    isRead: true,
  },
  
  // 关注通知
  {
    id: '7',
    type: 'follow',
    user: { 
      id: 'user7', 
      name: '吴九', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4小时前
    isRead: false,
  },
  {
    id: '8',
    type: 'follow',
    user: { 
      id: 'user8', 
      name: '郑十', 
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12小时前
    isRead: true,
  },
  {
    id: '9',
    type: 'follow',
    user: { 
      id: 'user9', 
      name: '冯十一', 
      avatar: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=40&h=40&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
    isRead: true,
  },
  
  // 系统通知
  {
    id: '10',
    type: 'system',
    content: '系统将于今晚23:00-02:00进行维护，届时服务可能暂时中断，敬请谅解。如有紧急问题，请联系客服。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8小时前
    isRead: false,
  },
  {
    id: '11',
    type: 'system',
    content: '新版本更新：增加了暗黑模式、优化了搜索功能、修复了若干已知问题。感谢您的持续关注！',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2天前
    isRead: true,
  },
  {
    id: '12',
    type: 'system',
    content: '春节活动开启：参与话题讨论即可获得积分奖励，积分可兑换精美礼品。活动时间：2月1日-2月15日。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3天前
    isRead: true,
  },
  
  // 更多数据用于展示分页功能
  ...Array.from({ length: 20 }, (_, index) => ({
    id: `bulk_${index + 13}`,
    type: ['like', 'comment', 'follow'][index % 3] as 'like' | 'comment' | 'follow',
    user: {
      id: `bulk_user_${index + 13}`,
      name: `用户${index + 13}`,
      avatar: `https://images.unsplash.com/photo-${1472099645785 + index}?w=40&h=40&fit=crop&crop=face`
    },
    post: index % 3 !== 2 ? {
      id: `bulk_post_${index + 13}`,
      type: ['article', 'image', 'video', 'dynamic'][index % 4] as 'article' | 'image' | 'video' | 'dynamic',
      title: `帖子标题 ${index + 13}`,
      content: `这是第${index + 13}个测试帖子的内容，用于展示分页功能和不同类型的消息通知...`,
      image: `https://images.unsplash.com/photo-${1506905925346 + index}?w=64&h=64&fit=crop`
    } : undefined,
    content: index % 3 === 1 ? `这是第${index + 13}条评论内容` : undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * (24 + index)).toISOString(),
    isRead: index % 2 === 0,
  })),
];

// 根据类型过滤通知
export const getNotificationsByType = (type: 'like' | 'comment' | 'follow' | 'system') => {
  return mockNotifications.filter(notification => notification.type === type);
};

// 导出各类型通知
export const likeNotifications = getNotificationsByType('like');
export const commentNotifications = getNotificationsByType('comment');
export const followNotifications = getNotificationsByType('follow');
export const systemNotifications = getNotificationsByType('system');

// 获取分页数据
export const getPaginatedNotifications = (
  notifications: BaseNotification[], 
  page: number, 
  pageSize: number = 50
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: notifications.slice(startIndex, endIndex),
    totalPages: Math.ceil(notifications.length / pageSize),
    currentPage: page,
    totalCount: notifications.length,
  };
}; 