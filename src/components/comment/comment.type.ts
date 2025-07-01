export interface CommentItem {
  id?: string;
  content: string;
  useId?: string;
  isLike?: boolean;
  likes?: number;
  postId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: string | null; // Optional for root comments
  children?: CommentItem[]; // Nested comments
}
