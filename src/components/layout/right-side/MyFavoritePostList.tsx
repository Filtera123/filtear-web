import { Link } from 'react-router-dom';

export default function MyFavoritePostList() {
  const favorites = [
    { id: 1, title: '收藏的文章1', author: '作者1' },
    { id: 2, title: '收藏的文章2', author: '作者2' },
    { id: 3, title: '收藏的文章3', author: '作者3' },
  ];

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-b-sm">
      <h2 className="text-lg font-semibold mb-4">我的收藏</h2>
      <div className="space-y-2">
        {favorites.map((item) => (
          <Link
            key={item.id}
            to={`/post/${item.id}`}
            className="block p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-gray-500">{item.author}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
