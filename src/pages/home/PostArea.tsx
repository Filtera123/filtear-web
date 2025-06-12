export default function PostArea() {
  return (
    <div className="flex justify-center gap-4 bg-white p-4 rounded-sm shadow-md">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">动态 + </button>
      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">图片</button>
      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">视频</button>
      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">文章</button>
    </div>
  );
}
