import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 定义浏览记录数据类型
interface ViewRecord {
  id: string;
  title: string;
  author: string;
  type: 'article' | 'image' | 'dynamic' | 'video';
  viewTime: Date;
  url: string;
  // newCount?: number; // 已移除新增作品数量属性
}

// 时间格式化工具函数
const formatViewTime = (date: Date): string => {
  const now = new Date();
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

export default function RecentlyViewed() {
  const [viewRecords, setViewRecords] = useState<ViewRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ViewRecord[]>([]);
  const [showMore, setShowMore] = useState(false);

  // 获取浏览记录数据
  useEffect(() => {
    const fetchViewRecords = async () => {
      // 模拟数据 - 实际应从后端或localStorage获取
      const mockData: ViewRecord[] = Array.from({ length: 25 }, (_, i) => ({
        id: `view-${i}`,
        title: `浏览记录标题 ${i + 1}`,
        author: `作者${(i % 5) + 1}`,
        type: ['article', 'image', 'dynamic', 'video'][i % 4] as
          | 'article'
          | 'image'
          | 'dynamic'
          | 'video',
        viewTime: new Date(Date.now() - i * 3600000 * ((i % 10) + 1)), // 不同时间的记录
        url: `/post/${i}`,
        // newCount: i > 0 ? Math.floor(Math.random() * 50) : undefined // 已移除新增数量生成代码
      }));

      // 过滤7天内的记录并按时间倒序排列
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const filtered = mockData
        .filter((record) => new Date(record.viewTime) >= sevenDaysAgo)
        .sort((a, b) => new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime());

      setViewRecords(filtered);
      setShowMore(filtered.length > 20);
    };

    fetchViewRecords();
  }, []);

  // 处理显示记录数量（最多20条）
  useEffect(() => {
    setFilteredRecords(viewRecords.slice(0, 20));
  }, [viewRecords]);

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      {/* 将标题和查看更多按钮放在同一行 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">最近浏览</h1>
        {showMore && (
          <Link to="/profile/recent-views" className="text-sm text-blue-500 hover:underline">
            查看更多
          </Link>
        )}
      </div>
      {/* TODO: 沒有登錄我們怎麼去記錄用戶的瀏覽記錄呢？如果這個瀏覽記錄是要寫入到後端的，那麼我們總得有個要寫給誰的對象吧？*/}
      {/* 直接显示浏览记录列表，无需登录判断 */}
      {filteredRecords.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
          <div className="space-y-3 pb-2">
            {filteredRecords.map((record) => (
              <Link
                key={record.id}
                to={record.url}
                className="block p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-medium line-clamp-1">{record.title}</h3>
                  {/* 已移除newCount显示部分 */}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{record.author}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">
                    {typeDisplayMap[record.type]}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {formatViewTime(new Date(record.viewTime))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-gray-500">
          暂无浏览记录
        </div>
      )}
      {/* 已移除底部的查看更多按钮 */}
    </div>
  );
}
