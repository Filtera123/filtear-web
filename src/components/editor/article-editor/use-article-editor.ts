import type { Comment } from '@/components/comment/comment.type';
import type { TagItem } from '@/components/tag/tag.type';

export interface ArticleContentItem {
  text: string;
  startIndex: number;
  endIndex: number;
  comment: Comment[];
}

export interface ArticleItem {
  id?: string;
  title?: string;
  summary?: string;
  contentItems?: ArticleContentItem[];
  tags?: TagItem[];
  createdAt?: Date;
  updatedAt?: Date;
  postUrl?: string;
  isRecycled?: boolean;
  isDraft?: boolean;
  isPinned?: boolean;
  editorHistory?: ArticleItem[];
  isPublic?: boolean;
  collectionId?: string;
}
