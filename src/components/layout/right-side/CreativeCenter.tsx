import { Link } from 'react-router-dom';

export default function CreativeCenter() {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-b-sm">
      <h2 className="text-lg font-semibold mb-4">创作者中心</h2>
      <div className="space-y-2">
        <Link
          to="/write"
          className="block p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          写文章
        </Link>
        <Link
          to="/upload"
          className="block p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          上传视频
        </Link>
        <Link
          to="/publish"
          className="block p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          发布动态
        </Link>
      </div>
    </div>
  );
}
