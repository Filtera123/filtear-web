import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';

// 模拟草稿数据
interface DraftItem {
  id: string;
  title: string;
  content: string;
  lastSaved: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'longtext';
}

const mockDrafts: DraftItem[] = [
  {
    id: '1',
    title: '未命名草稿1',
    content: '这是一篇未完成的文章草稿...',
    lastSaved: '2023-08-15 14:30',
    type: 'text'
  },
  {
    id: '2',
    title: '我的旅行照片',
    content: '包含5张图片的草稿',
    lastSaved: '2023-08-14 09:15',
    type: 'image'
  },
  {
    id: '3',
    title: '视频剪辑',
    content: '一段未完成的视频',
    lastSaved: '2023-08-12 18:45',
    type: 'video'
  }
];

export default function DraftsBox() {
  const [drafts, setDrafts] = useState<DraftItem[]>(mockDrafts);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发草稿点击事件
    setDraftToDelete(draftId);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDraftToDelete(null);
  };

  // 确认删除草稿
  const handleConfirmDelete = () => {
    if (draftToDelete) {
      setDrafts(drafts.filter(draft => draft.id !== draftToDelete));
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">草稿箱</h1>
        <p className="text-gray-600">查看和管理您保存的草稿</p>
      </div>

      {/* 草稿箱主界面 */}
      <Card>
        <CardContent className="p-6">
          {/* 草稿内容区 */}
          <div className="space-y-6">
            {/* 保存的草稿列表 */}
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div 
                  key={draft.id} 
                  className="border border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{draft.title}</h3>
                      <p className="text-gray-600 text-sm">{draft.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {draft.lastSaved}
                      </span>
                      <button 
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        onClick={(e) => handleOpenDeleteDialog(draft.id, e)}
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          确认删除
        </DialogTitle>
        <DialogContent>
          <p className="py-2">您确定要删除这个草稿吗？此操作无法撤销。</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 