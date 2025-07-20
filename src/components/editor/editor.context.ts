import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
// --- Custom Extensions ---
import { Link } from './extension/Link.extension.ts';
import { Selection } from './extension/Selection.extension.ts';
import { TrailingNode } from './extension/TrailingNode.extension.ts';

export const useArticleEditor = () =>
  useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
    },
    extensions: [
      Placeholder.configure({
        // Use a placeholder:
        placeholder: '明天会是新的一天 …',
      }),
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      TrailingNode,
      Link.configure({ openOnClick: false }),
      Selection,
    ],
  });
