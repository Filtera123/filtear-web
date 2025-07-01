import { Link } from 'react-router-dom';

export default function TrendingListBar() {
  const trendingItems = [
    { id: 1, title: '热门话题1', views: '10.2k' },
    { id: 2, title: '热门话题2', views: '8.5k' },
    { id: 3, title: '热门话题3', views: '6.8k' },
    { id: 4, title: '热门话题4', views: '5.1k' },
  ];

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-b-sm">
      <h2 className="text-lg font-semibold mb-4">热门话题</h2>
      <div className="space-y-2">
        {trendingItems.map((item) => (
          <Link
            key={item.id}
            to={`/trending/${item.id}`}
            className="flex justify-between items-center p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <span className="text-sm">{item.title}</span>
            <span className="text-xs text-gray-500">{item.views}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
