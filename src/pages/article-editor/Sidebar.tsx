import { useDraftStore } from '@components/editor/draft.store';
import { IconButton, Stack } from '@mui/material';
import { IconCircleMinus, IconEdit } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const { drafts, deleteDraft } = useDraftStore();

  return (
    <Stack spacing={2} className="p-4">
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <p>草稿箱(1/25)</p>
        <ul>
          {drafts.map((draft, idx) => (
            <li key={draft.id} className="mb-2">
              <Stack spacing={2}>
                <span>{draft.title || `未命名-${idx + 1}}`}</span>
                <span>{draft.updatedAt && new Date(draft.updatedAt).toLocaleDateString()}</span>
              </Stack>
              <Stack
                spacing={2}
                direction="row"
                className="mt-2"
                sx={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <IconButton size="small" className="ml-2">
                  <IconEdit />
                </IconButton>
                <IconButton
                  size="small"
                  className="ml-2"
                  color="error"
                  onClick={() => draft.id && deleteDraft(draft.id)}
                >
                  <IconCircleMinus />
                </IconButton>
              </Stack>
            </li>
          ))}
        </ul>
      </div>
    </Stack>
  );
}
