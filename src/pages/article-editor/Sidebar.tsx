import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useDraftStore } from '../../components/editor/draft.store';

export default function Sidebar() {
  const { drafts, deleteDraft } = useDraftStore();
  const [, setSearchParams] = useSearchParams();

  return (
    <Stack spacing={2}>
      <Link 
        to="/" 
        className="hover:underline hover:opacity-80 transition-opacity bg-white px-4 py-2 rounded-md" 
        style={{ color: '#7E44C6' }}
      >
        返回首页
      </Link>
      <div className="p-4 bg-white rounded-sm h-[calc(100vh-8rem)] overflow-y-auto">
        <p>
          <span>草稿箱</span>&nbsp;
          <span className="text-gray-500">({drafts.length})</span>
        </p>
        <div className="space-y-2 mt-4">
          {drafts.length === 0 ? (
            <p className="text-gray-500 text-sm">暂无草稿</p>
          ) : (
            drafts.map((draft: any) => (
              <div key={draft.id} className="p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">
                      {draft.title || '无标题'}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(draft.updatedAt).toLocaleString()}
                    </p>
                    {draft.content && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {draft.content.slice(0, 50)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setSearchParams({ draftId: draft.id });
                      }}
                      className="text-xs px-2 py-1 text-white rounded hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#7E44C6' }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Stack>
  );
}