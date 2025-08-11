export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userIpLocation?: string; // 新增：用户IP地址
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}
