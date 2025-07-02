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
  tempDraftId?: string;
  title?: string;
  summary?: string;
  contentItems?: ArticleContentItem[];
  tags?: TagItem[];
  createdAt?: string;
  updatedAt?: string;
  postUrl?: string;
  isRecycled?: boolean;
  isLiked?: boolean;
  isCollected?: boolean;
  viewCount?: number;
  likes?: number;
  collectionCount?: number;
  isDraft?: boolean;
  isPinned?: boolean;
  editorHistory?: ArticleItem[];
  isPublic?: boolean;
  collectionId?: string;
}
