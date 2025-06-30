export default function GlobalSearchBar() {
  return (
    <div className="flex justify-center ">
      <input
        name="global-search"
        type="text"
        placeholder="搜索..."
        className="w-full bg-white max-w-md px-4 py-2 rounded-sm focus:outline-none focus:ring-2
        focus:ring-primary transition-colors border border-pink-300 hover:border-gray-400 focus:border-primary"
      />
    </div>
  );
}
