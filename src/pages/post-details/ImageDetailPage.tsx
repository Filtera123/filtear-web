import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCommentStore } from '@/components/comment/Comment.store';
import ImageDetailModal from './ImageDetail';

export default function ImageDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { comments: storeComments, setComments } = useCommentStore();
  const [post, setPost] = useState<any>(null);

  // 从路由状态或API获取帖子数据
  useEffect(() => {
    if (location.state) {
      // 如果有路由状态，直接使用
      setPost(location.state);
    } else if (postId) {
      // 如果没有状态，根据ID获取数据（这里应该调用API）
      // 暂时使用模拟数据
      const mockPost = {
        id: postId,
        type: 'image',
        title: '图片标题',
        content: '图片描述',
        author: '作者名称',
        authorAvatar: `https://picsum.photos/id/64/40/40`,
        createdAt: new Date().toISOString(),
        images: [
          {
            url: `https://picsum.photos/id/50/400/300`,
            alt: '图片1',
            width: 400,
            height: 300,
          },
          {
            url: `https://picsum.photos/id/51/400/300`,
            alt: '图片2',
            width: 400,
            height: 300,
          },
        ],
        likes: 100,
        comments: 20,
        views: 500,
        isLike: false,
        isFollowing: false,
        commentList: [],
      };
      setPost(mockPost);
    }
  }, [postId, location.state]);

  // 初始化评论数据到store
  useEffect(() => {
    if (post && post.commentList !== undefined && !storeComments[post.id]) {
      setComments(post.id, post.commentList);
      console.log('初始化图片详情页评论数据:', post.id, post.commentList);
    }
  }, [post, storeComments, setComments]);

  const handleClose = () => {
    // 检查是否有指定的来源页面
    if (location.state?.fromPage) {
      navigate(location.state.fromPage);
    } else {
      // 尝试返回上一页，如果没有历史记录则回到首页
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return <ImageDetailModal post={post} onClose={handleClose} />;
} 