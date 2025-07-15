import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { TagItem } from '@/components/tag/tag.type';
import { PostType } from '@/components/post-card/post.types';
import type { PostTypeValue } from '@/components/post-card/post.types';
import type { Comment } from '../components/comment/comment.type';

// 定义浏览记录数据类型（基础类型）
interface ViewRecord {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  type: PostTypeValue;
  viewTime: Date;
  createdAt: string;
  updatedAt: string;
  slug: string;
  category: string;
  categorySlug: string;
  content: string;
  tags: TagItem[];
  likes: number;
  comments: number;
  views: number;
  isLike: boolean;
  isFollowing?: boolean;
  commentList: Comment[]; 
}

// 扩展类型 - 文章
interface ArticleViewRecord extends ViewRecord {
  type: typeof PostType.ARTICLE;
  abstract?: string;
  wordCount: number;
}

// 扩展类型 - 图片
interface ImageViewRecord extends ViewRecord {
  type: typeof PostType.IMAGE;
  images: Array<{
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
}

// 扩展类型 - 视频
interface VideoViewRecord extends ViewRecord {
  type: typeof PostType.VIDEO;
  video: {
    url: string;
    thumbnail: string;
    duration: number;
    width?: number;
    height?: number;
  };
}

// 扩展类型 - 动态
interface DynamicViewRecord extends ViewRecord {
  type: typeof PostType.DYNAMIC;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
}

// 联合类型
type AllViewRecord = ArticleViewRecord | ImageViewRecord | VideoViewRecord | DynamicViewRecord;

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

// 获取内容预览
const getContentPreview = (content: string) => {
  return content?.substring(0, 150) || '无内容';
};

export default function RecentlyViewed() {
  const navigate = useNavigate();
  const [viewRecords, setViewRecords] = useState<AllViewRecord[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // 获取浏览记录数据
  useEffect(() => {
    const fetchViewRecords = async () => {
      // 模拟数据 - 实际应从后端或localStorage获取
      const mockData: AllViewRecord[] = Array.from({ length: 25 }, (_, i) => {
        const recordType = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC][i % 4];
        const baseRecord = {
          id: `view-${i}`,
          title: `最近浏览的帖子 ${i + 1}`,
          author: `作者${(i % 5) + 1}`,
          authorAvatar: `https://picsum.photos/40/40?random=${i}`,
          viewTime: new Date(Date.now() - i * 3600000 * ((i % 10) + 1)), // 不同时间的记录
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slug: `post-${i}`,
          category: '技术',
          categorySlug: 'tech',
          content: `这是一段内容描述，描述了帖子的主要内容。这是第 ${i + 1} 条记录。`,
          tags: [
            { id: '1', name: '标签1', isPopular: true },
            { id: '2', name: '标签2', isPopular: false },
          ],
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          views: Math.floor(Math.random() * 5000),
          isLike: Math.random() > 0.7,
          isFollowing: Math.random() > 0.8,
          commentList: [] as Comment[], // 明确类型标注
        };

        // 根据记录类型添加特定属性
        switch (recordType) {
          case PostType.ARTICLE:
            return {
              ...baseRecord,
              type: PostType.ARTICLE,
              abstract: `这是关于帖子 ${i + 1} 的摘要...`,
              wordCount: Math.floor(Math.random() * 5000) + 500, // 500-5500字
            } as ArticleViewRecord;
          case PostType.IMAGE:
            return {
              ...baseRecord,
              type: PostType.IMAGE,
              images: [
                {
                  url: `https://picsum.photos/400/300?random=${i}`,
                  alt: `图片${i}`,
                  width: 400,
                  height: 300,
                }
              ],
            } as ImageViewRecord;
          case PostType.VIDEO:
            return {
              ...baseRecord,
              type: PostType.VIDEO,
              video: {
                url: `https://example.com/video${i}.mp4`,
                thumbnail: `https://picsum.photos/400/300?random=${i + 100}`,
                duration: Math.floor(Math.random() * 300) + 30, // 30-330秒
                width: 720,
                height: 480,
              },
            } as VideoViewRecord;
          case PostType.DYNAMIC:
            return {
              ...baseRecord,
              type: PostType.DYNAMIC,
              images: Math.random() > 0.5 ? [
                {
                  url: `https://picsum.photos/400/300?random=${i}`,
                  alt: `动态图片${i}`,
                }
              ] : undefined,
            } as DynamicViewRecord;
          default:
            // 确保默认情况下也返回有效的记录类型
            return {
              ...baseRecord,
              type: PostType.ARTICLE,
              wordCount: 1000,
            } as ArticleViewRecord;
        }
      });

      // 按时间倒序排列（最近浏览的排在最前面）
      const sorted = mockData.sort((a, b) => 
        new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime()
      );

      setViewRecords(sorted);
    };

    fetchViewRecords();
  }, []);

  // 根据帖子类型生成正确的URL
  const getPostDetailUrl = useCallback((post: AllViewRecord) => {
    switch (post.type) {
      case PostType.ARTICLE:
        return `/post/article/${post.id}`;
      case PostType.IMAGE:
        return `/post/image/${post.id}`;
      case PostType.VIDEO:
        return `/post/video/${post.id}`;
      case PostType.DYNAMIC:
        return `/post/dynamic/${post.id}`;
      default:
        return `/post/${post.id}`;
    }
  }, []);

  // 处理帖子点击
  const handlePostClick = useCallback((post: AllViewRecord) => {
    navigate(getPostDetailUrl(post), { state: post });
  }, [navigate, getPostDetailUrl]);

  // 处理用户点击
  const handleUserProfileClick = useCallback((e: React.MouseEvent, post: AllViewRecord) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    navigate(`/user/${post.author}`);
  }, [navigate]);

  // 获取帖子当前的点赞状态
  const getPostLikeStatus = useCallback((post: AllViewRecord) => {
    // 如果本地状态中有该帖子的点赞状态，则使用本地状态，否则使用帖子原始状态
    return likedPosts[post.id] !== undefined ? likedPosts[post.id] : post.isLike;
  }, [likedPosts]);

  // 处理点赞点击
  const handleLikeClick = useCallback((e: React.MouseEvent, post: AllViewRecord) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击事件
    
    // 更新本地点赞状态
    setLikedPosts(prev => {
      const currentLikeState = prev[post.id] !== undefined ? prev[post.id] : post.isLike;
      const newLikeState = !currentLikeState;
      
      // 在真实场景下，这里应该调用API更新点赞状态
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, post.id);
      
      return {
        ...prev,
        [post.id]: newLikeState
      };
    });
  }, []);

  // 网格视图渲染卡片
  const renderGridCard = (post: AllViewRecord) => {
    const isLiked = getPostLikeStatus(post);

    return (
      <div
        key={post.id}
        className="bg-white rounded-md shadow-sm border border-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handlePostClick(post)}
      >
        {/* 卡片内容区域 */}
        <div className="flex-grow relative">
          {/* 图片 / 视频 / 纯文本预览 */}
          {post.type === PostType.IMAGE && 'images' in post && post.images && post.images.length > 0 ? (
            <img
              src={post.images[0].url}
              alt={post.images[0].alt || '图片'}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
              }}
            />
          ) : post.type === PostType.VIDEO && 'video' in post && post.video ? (
            <div className="h-full w-full bg-gray-100 relative">
              <img
                src={post.video.thumbnail}
                alt="视频缩略图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 h-full overflow-hidden">
              <p className="text-sm line-clamp-6 text-gray-700">
                {getContentPreview(post.content || '')}
              </p>
            </div>
          )}
        </div>

        {/* 卡片底部信息区域 */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-base font-medium mb-2 line-clamp-1">{post.title}</h3>

          <div className="flex justify-between items-center text-xs text-gray-500">
            {/* 作者头像 + 名字 */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
              onClick={(e) => handleUserProfileClick(e, post)}
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="truncate max-w-[80px]">{post.author}</span>
            </div>

            {/* 点赞按钮 */}
            <span
              className={`flex items-center cursor-pointer ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
              onClick={(e) => handleLikeClick(e, post)}
            >
              <svg
                className="w-4 h-4 mr-0.5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {/* 动态显示点赞数量 */}
              {post.likes + (isLiked && !post.isLike ? 1 : 0) - (!isLiked && post.isLike ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">最近浏览</h1>
          <p className="text-gray-500">您最近浏览过的内容</p>
        </div>

        {viewRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viewRecords.map((record) => (
              <div key={record.id} className="h-auto" style={{ minHeight: '280px' }}>
                {renderGridCard(record)}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-lg font-medium text-gray-500">暂无浏览记录</p>
            <p className="mt-2 text-gray-400">浏览内容后将会在这里显示</p>
          </div>
        )}
      </div>
    </div>
  );
} 