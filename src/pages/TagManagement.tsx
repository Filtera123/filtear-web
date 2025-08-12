import { useState, useRef, useEffect, useCallback } from 'react';
import { useTagSubscriptionStore } from '../stores/tagSubscriptionStore';
import { Tag } from '../components/index';
import { IconSearch, IconX, IconShieldOff, IconDeviceFloppy } from '@tabler/icons-react';
import type { TagItem } from '../components/tag/tag.type';

export default function TagManagement() {
  const { 
    getFilteredTags, 
    setSearchQuery, 
    unfollowTag,
    blockTag, 
    reorderTags,
    saveTagOrder,
    discardTagOrder,
    searchQuery 
  } = useTagSubscriptionStore();
  
  const tags = getFilteredTags();
  const [draggingTagId, setDraggingTagId] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmDialogState, setConfirmDialogState] = useState<{
    tagId: string | null;
    tagName: string | null;
    action: 'unfollow' | 'block' | null;
  }>({ tagId: null, tagName: null, action: null });

  // Prompt user if they try to leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Clear search on component unmount and discard temporary tag order
  useEffect(() => {
    return () => {
      setSearchQuery('');
      // Discard any unsaved changes when leaving the page
      discardTagOrder();
    };
  }, [setSearchQuery, discardTagOrder]);

  // Handle tag search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Open confirmation dialog
  const openConfirmDialog = (tagId: string, tagName: string, action: 'unfollow' | 'block') => {
    setConfirmDialogState({ tagId, tagName, action });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialogState({ tagId: null, tagName: null, action: null });
  };

  // Handle tag unfollow
  const handleUnfollow = (tagId: string) => {
    unfollowTag(tagId);
    closeConfirmDialog();
  };

  // Handle tag block
  const handleBlock = (tagId: string) => {
    blockTag(tagId);
    closeConfirmDialog();
  };

  // Handle tag click to navigate to tag page
  const handleTagClick = (tagName: string) => {
    window.location.href = `/tag/${encodeURIComponent(tagName)}`;
  };

  // Handle saving tag order
  const handleSaveOrder = () => {
    saveTagOrder();
    setHasUnsavedChanges(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number, tagId: string) => {
    dragItem.current = index;
    setDraggingTagId(tagId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a delay to make the dragged item appear to be picked up
    setTimeout(() => {
      setDraggingTagId(tagId);
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      reorderTags(dragItem.current, dragOverItem.current);
      setHasUnsavedChanges(true);
    }
    
    setDraggingTagId(null);
    dragItem.current = null;
    dragOverItem.current = null;
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggingTagId(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">我的订阅</h1>
        
        {/* Help text moved to top */}
        <p className="text-gray-500 mb-6 text-sm">
          提示：可以通过拖拽调整标签顺序，标签前的数字表示排序序号，排序靠前的标签将显示在首页侧边栏靠上位置
        </p>
        
        {/* Search Bar and Save Button in separate rows */}
        <div className="mb-6">
          {/* Search Bar */}
          <div className="flex items-center w-full rounded-lg border border-gray-300 overflow-hidden mb-4">
            <div className="pl-4">
              <IconSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="搜索已订阅标签"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-3 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="pr-4 text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            )}
          </div>
          
          {/* Save Button - Separate row for more prominence */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              {hasUnsavedChanges ? '* 您已调整标签顺序，请保存更改' : ''}
            </div>
            <button
              onClick={handleSaveOrder}
              disabled={!hasUnsavedChanges}
              className={`flex items-center gap-2 px-6 py-2 rounded-md transition-colors ${
                hasUnsavedChanges 
                  ? 'text-white hover:opacity-90 shadow-sm' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              style={hasUnsavedChanges ? { backgroundColor: '#7E44C6' } : {}}
            >
              <IconDeviceFloppy size={20} />
              保存排序
            </button>
          </div>
        </div>
        
        {/* Tags Grid */}
        {tags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tags.map((tag: TagItem, index: number) => (
              <div
                key={tag.id || tag.name}
                draggable
                onDragStart={(e) => handleDragStart(e, index, tag.id || tag.name)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`bg-white p-4 rounded-md border ${
                  draggingTagId === (tag.id || tag.name)
                    ? 'opacity-50'
                    : ''
                } transition-all hover:shadow-md cursor-grab relative`}
                style={draggingTagId === (tag.id || tag.name) ? { borderColor: '#7E44C6' } : {}}
              >
                <div className="flex flex-col">
                  {/* Tag name, number and post count on one line */}
                  <div 
                    className="flex items-center mb-3 cursor-pointer"
                  >
                    <span className="flex items-center justify-center min-w-[24px] h-6 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div 
                      onClick={() => handleTagClick(tag.name)} 
                      className="flex items-center justify-between flex-grow mx-2"
                    >
                      <div className="max-w-[150px] overflow-hidden">
                        <Tag tag={tag} className="text-lg" maxLength={4} />
                      </div>
                      <span className="text-xs text-gray-500 ml-auto pl-2">12.3k</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => openConfirmDialog(tag.id || tag.name, tag.name, 'unfollow')}
                      className="text-gray-400 hover:text-red-500 transition-colors py-1 px-3 rounded-md hover:bg-red-50 text-sm"
                    >
                      取消关注
                    </button>
                    <button
                      onClick={() => openConfirmDialog(tag.id || tag.name, tag.name, 'block')}
                      className="text-gray-400 hover:opacity-80 transition-opacity py-1 px-3 rounded-md text-sm flex items-center gap-1"
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#7E44C6';
              (e.target as HTMLElement).style.backgroundColor = '#f3f0ff';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = '#9ca3af';
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <IconShieldOff size={14} />
                      屏蔽
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {searchQuery ? '没有找到匹配的标签' : '你还没有关注任何标签'}
            </p>
          </div>
        )}
      </div>

      {/* Central Confirmation Dialog */}
      {confirmDialogState.tagId && confirmDialogState.tagName && confirmDialogState.action && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-medium mb-4">确认操作</h3>
            <p className="text-gray-600 mb-6">
              {confirmDialogState.action === 'unfollow' 
                ? `确定要取消关注 #${confirmDialogState.tagName} 标签吗？` 
                : `确定要屏蔽 #${confirmDialogState.tagName} 标签吗？`}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={closeConfirmDialog}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => confirmDialogState.action === 'unfollow' 
                  ? handleUnfollow(confirmDialogState.tagId!)
                  : handleBlock(confirmDialogState.tagId!)
                }
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  confirmDialogState.action === 'unfollow' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'text-white hover:opacity-90'
                }`}
                style={confirmDialogState.action !== 'unfollow' ? { backgroundColor: '#7E44C6' } : {}}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 