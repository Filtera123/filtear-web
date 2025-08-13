import React from 'react';
import { useDraftStore } from '@components/editor/draft.store';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Button, Stack } from '@mui/material';
import { IconCircleMinus } from '@tabler/icons-react';
import { cn } from '@utils/cn';
import { Link, useSearchParams } from 'react-router-dom';

export default function Sidebar() {
  const { drafts, deleteDraft } = useDraftStore();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Stack spacing={2}>
      <Link to="/" className="text-blue-500 hover:underline bg-white px-4 py-2 rounded-md">
        返回首页
      </Link>
      <div className="p-4 bg-white rounded-sm h-[calc(100vh-8rem)] overflow-y-auto">
        <p>
          <span>草稿箱</span>&nbsp;
          <span className="text-gray-400">(1/25)</span>
        </p>
        <div className="list-none p-0 mt-6 flex flex-col gap-2">
          {drafts.map((draft, idx) => (
            <div
              role="button"
              key={draft.id}
              className={cn('mb-2 p-4 bg-gray-50 rounded-md text-sm cursor-pointer text-left', {
                'bg-indigo-50':
                  searchParams.get('id') === draft.tempDraftId ||
                  searchParams.get('id') === draft.id,
              })}
              onClick={() => {
                setSearchParams({
                  id: draft.tempDraftId || draft.id,
                });
              }}
            >
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <div>
                  <span className="line-clamp-1">{draft.title || `未命名-${idx + 1}}`}</span>
                  <span className="text-gray-500">{draft.updatedAt && draft.updatedAt}</span>
                </div>
                <Popover>
                  <PopoverButton className="text-red-500 cursor-pointer p-1 hover:bg-red-50 rounded-full">
                    <IconCircleMinus />
                  </PopoverButton>
                  <PopoverPanel
                    transition
                    anchor="bottom"
                    className="divide-y p-4 divide-white/5 rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(2)] data-closed:-translate-y-1 data-closed:opacity-0"
                  >
                    <Stack>
                      <span> 请问你确定要删除草稿吗？</span>
                      <div className="flex justify-end mt-2">
                        <Button
                          size="small"
                          color="error"
                          onClick={() => draft.id && deleteDraft(draft.tempDraftId || draft.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </Stack>
                  </PopoverPanel>
                </Popover>
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </Stack>
  );
}