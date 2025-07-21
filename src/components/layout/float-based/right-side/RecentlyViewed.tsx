import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrowsingHistoryStore, type BrowsingRecord } from '@/stores/browsingHistoryStore';
import { Image } from '@/components/ui';

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

export default function RecentlyViewed() {
  const { getRecentRecords, cleanupDuplicates } = useBrowsingHistoryStore();
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

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">最近浏览</h1>
        {recentRecords.length > 0 && (
          <Link to="/recently-viewed" className="text-sm text-blue-500 hover:underline">
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
                <Link
                  key={`${record.id}-${record.viewTime}`}
                  to={record.url}
                  className="block hover:bg-gray-50 rounded-lg transition-colors"
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
                </Link>
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
