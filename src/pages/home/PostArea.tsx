import { Link } from 'react-router-dom';

export default function PostArea() {
  return (
    <div className="flex justify-center gap-4 bg-white p-4 border border-gray-200 border-t-0">
      <button className="text-white px-4 py-2 rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7E44C6' }}>动态 + </button>
      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">图片</button>
      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">视频</button>
      <Link
        to="/editor/user/normal"
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors inline-block"
      >
        文章
      </Link>
    </div>
  );
}
