export default function GlobalSearchBar() {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-b-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索内容..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
