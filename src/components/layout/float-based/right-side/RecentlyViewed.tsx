import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBrowsingHistoryStore, type BrowsingRecord } from '@/stores/browsingHistoryStore';
import { useCommentStore } from '@/components/comment/Comment.store';
import { Image } from '@/components/ui';
import { PostType, type PostItem } from '@/components/post-card/post.types';
import { mockPosts } from '@/mocks/post/data';
import { getRandomIpLocation } from '@/utils/mockData';

// 时间格式化工具函数
const formatViewTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 3) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
};

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

// 模拟播放时长（实际项目中应该从数据源获取）
const getMockDuration = (type: string): string => {
  if (type === 'video') {
    const durations = ['13:00', '05:30', '08:45', '12:15', '03:20'];
    return durations[Math.floor(Math.random() * durations.length)];
  }
  return '';
};

// 生成字符串的固定哈希值
const generateHashFromString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// 将浏览记录转换为PostItem格式（简化版）
const convertBrowsingRecordToPostItem = (record: BrowsingRecord, storeComments: Record<string, any> = {}): PostItem => {
  // 尝试从mockPosts中找到真实的帖子数据
  const realPost = mockPosts.find(post => post.id === record.id);
  
  // 基于帖子ID生成固定的数据，确保数据一致性
  const idHash = generateHashFromString(record.id);
  const authorHash = generateHashFromString(record.author);
  
  // 获取评论数据：优先使用store中的数据，然后是真实帖子的评论，最后是空数组
  const commentList = storeComments[record.id] || realPost?.commentList || [];
  
  const basePost = {
    id: record.id,
    author: record.author,
    authorAvatar: record.authorAvatar || realPost?.authorAvatar || `https://via.placeholder.com/40x40?text=${record.author[0]}`,
    authorIpLocation: realPost?.authorIpLocation || getRandomIpLocation(idHash),
    createdAt: realPost?.createdAt || record.viewTime,
    updatedAt: realPost?.updatedAt || record.viewTime,
    slug: realPost?.slug || `browsing-${record.id}`,
    summary: (realPost as any)?.abstract || record.title,
    category: realPost?.category || typeDisplayMap[record.type],
    categorySlug: realPost?.categorySlug || record.type,
    title: record.title,
    tags: realPost?.tags || [{ 
      id: record.type, 
      name: typeDisplayMap[record.type],
      color: '#7E44C6'
    }],
    isLike: realPost?.isLike || false,
    // 优先使用真实数据，否则使用固定生成的数据
    likes: realPost?.likes || ((idHash % 50) + 10), // 10-59的固定点赞数
    comments: commentList.length || realPost?.comments || ((idHash % 20) + 5), // 使用真实评论数量
    commentList: commentList,
    views: realPost?.views || ((idHash % 200) + 50), // 50-249的固定浏览数
    isFollowing: realPost?.isFollowing || ((authorHash % 10) < 3), // 基于作者ID生成固定的关注状态（30%概率）
  };

  // 根据类型返回不同的PostItem
  switch (record.type) {
    case 'article':
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: realPost?.content || record.title,
        abstract: (realPost as any)?.abstract || `这是一篇关于${record.title}的文章...`,
        wordCount: (realPost as any)?.wordCount || ((idHash % 3000) + 1000), // 基于ID生成固定字数
      };
    
    case 'image':
      // 确保图片帖子至少有一张图片，避免详情页出错
      const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format';
      return {
        ...basePost,
        type: PostType.IMAGE,
        content: realPost?.content || record.title,
        images: (realPost as any)?.images || [{
          url: record.thumbnail || defaultThumbnail,
          alt: record.title || '图片内容',
          width: 800,
          height: 600,
        }],
      };
    
    case 'video':
      return {
        ...basePost,
        type: PostType.VIDEO,
        content: realPost?.content || record.title,
        video: (realPost as any)?.video || {
          url: 'https://example.com/sample-video.mp4', // 使用示例视频URL
          thumbnail: record.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format',
          duration: 780, // 13分钟转换为秒
          width: 1920,
          height: 1080,
        },
      };
    
    case 'dynamic':
      return {
        ...basePost,
        type: PostType.DYNAMIC,
        content: realPost?.content || record.title,
        images: (realPost as any)?.images || (record.thumbnail ? [{
          url: record.thumbnail,
          alt: record.title,
        }] : undefined),
      };
    
    default:
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: realPost?.content || record.title,
        abstract: (realPost as any)?.abstract || `这是一篇关于${record.title}的内容...`,
        wordCount: (realPost as any)?.wordCount || ((idHash % 2000) + 500), // 基于ID生成固定字数
      };
  }
};

export default function RecentlyViewed() {
  const { getRecentRecords, cleanupDuplicates } = useBrowsingHistoryStore();
  const { comments: storeComments } = useCommentStore();
  const navigate = useNavigate();
  const [recentRecords, setRecentRecords] = useState<BrowsingRecord[]>([]);

  // 组件挂载时清理重复数据
  useEffect(() => {
    cleanupDuplicates();
  }, [cleanupDuplicates]);

  // 获取最近浏览记录
  useEffect(() => {
    const records = getRecentRecords(6); // 改为显示6条，适合卡片布局
    setRecentRecords(records);
  }, [getRecentRecords]);

  // 定期刷新数据（当用户在其他页面浏览后回到当前页面）
  useEffect(() => {
    const interval = setInterval(() => {
      const records = getRecentRecords(6);
      setRecentRecords(records);
    }, 5000); // 每5秒检查一次

    return () => clearInterval(interval);
  }, [getRecentRecords]);

  // 处理帖子点击
  const handlePostClick = (record: BrowsingRecord) => {
    const postData = convertBrowsingRecordToPostItem(record, storeComments);
    navigate(record.url, { 
      state: {
        ...postData,
        fromPage: '/recently-viewed-sidebar' // 记录来源页面
      }
    });
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">最近浏览</h1>
        {recentRecords.length > 0 && (
          <Link to="/recently-viewed" className="text-sm hover:underline hover:opacity-80 transition-opacity" style={{ color: '#7E44C6' }}>
            查看更多
          </Link>
        )}
      </div>
      
      {recentRecords.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
          <div className="space-y-4">
            {recentRecords.map((record) => {
              const duration = getMockDuration(record.type);
              return (
                <div
                  key={`${record.id}-${record.viewTime}`}
                  onClick={() => handlePostClick(record)}
                  className="block hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="relative">
                    {/* 预览图容器 */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {record.thumbnail ? (
                        <Image
                          src={record.thumbnail}
                          alt={record.title}
                          className="w-full h-full object-cover"
                          fallbackText={typeDisplayMap[record.type]}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                          {typeDisplayMap[record.type]}
                        </div>
                      )}
                      
                      {/* 播放时长标签（只有视频类型显示） */}
                      {duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                          {duration}
                        </div>
                      )}
                      
                      {/* 视频播放图标 */}
                      {record.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 内容信息 */}
                    <div className="pt-2">
                      {/* 标题 */}
                      <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-900">
                        {record.title}
                      </h3>
                      
                      {/* 作者信息 */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="truncate">{record.author}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full flex-shrink-0 ml-2">
                          {typeDisplayMap[record.type]}
                        </span>
                      </div>
                      
                      {/* 浏览时间 */}
                      <div className="text-xs text-gray-400">
                        {formatViewTime(record.viewTime)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-gray-500">
          暂无浏览记录
        </div>
      )}
    </div>
  );
}
