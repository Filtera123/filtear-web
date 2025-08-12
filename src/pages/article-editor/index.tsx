import Sidebar from './Sidebar';
import Editor from './Editor';
import Aside from './Aside';

export default function ArticleEditor() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 左侧边栏 */}
        <div className="w-1/4 h-full border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        {/* 编辑器主体 */}
        <div className="flex-1 h-full">
          <Editor />
        </div>

        {/* 右侧边栏 */}
        <div className="w-1/4 h-full border-l border-gray-200 bg-white">
          <Aside />
        </div>
      </div>
    </div>
  );
}