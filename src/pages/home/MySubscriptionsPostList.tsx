import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullPostCard } from './../../components/post-card';
import PostArea from './PostArea';
import { type Comment } from '../../components/comment/comment.type';

interface Post {
  id: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  category: string;
  categorySlug: string;
  readingTime: number;
  title: string;
  content: string;
  tags: string[];
  isLike: boolean;
  likes: number;
  comments: number;
  commentList?: Comment[];
  views?: number;
  isFollowing?: boolean;
}

export default function MySubscriptionsList() {
  const navigate = useNavigate();
  const [postList, setPostList] = useState<Post[]>([
    {
      id: 1,
      author: '墨染青花',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      slug: 'sample-post',
      category: '原神',
      categorySlug: 'genshin',
      readingTime: 5,
      title: '《满月浮的月夜》- 原神同人小说',
      content: '夜幕降临，璃月港的灯火星星点点亮起。钟离站在石板路上，月光洒在他的肩头上，为这位岩王帝君罩上了几分温柔...',
      tags: ['原神', '小说', '虚构', '满月', '同人小说', '璃月港', '钟离', '岩王帝君', '月夜', '浪漫', '文学创作', '游戏同人', '中文小说', '幻想', '古风', '温柔', '诗意', '夜景'],
      isLike: false,
      likes: 234,
      comments: 8,
      commentList: [
        {
          id: 'comment-1-1',
          userId: 'user1',
          userName: '云中君',
          userAvatar: '/default-avatar.png',
          content: '写得真好！钟离的形象刻画得很生动，期待后续！',
          createdAt: '2024-01-15T12:00:00Z',
          likes: 5,
          isLiked: false,
          replies: [
            {
              id: 'reply-1-1-1',
              userId: 'user2',
              userName: '墨染青花',
              userAvatar: '/default-avatar.png',
              content: '谢谢支持！后续会更精彩的～',
              createdAt: '2024-01-15T12:30:00Z',
              likes: 2,
              isLiked: true,
            }
          ]
        },
        {
          id: 'comment-1-2',
          userId: 'user3',
          userName: '风之诗人',
          userAvatar: '/default-avatar.png',
          content: '璃月港的夜景描写很有画面感，仿佛能看到月光下的钟离',
          createdAt: '2024-01-15T14:00:00Z',
          likes: 8,
          isLiked: true,
        },
        {
          id: 'comment-1-3',
          userId: 'user4',
          userName: '旅行者',
          userAvatar: '/default-avatar.png',
          content: '收藏了！什么时候更新下一章？',
          createdAt: '2024-01-15T16:00:00Z',
          likes: 3,
          isLiked: false,
        },
        {
          id: 'comment-1-4',
          userId: 'user5',
          userName: '璃月商人',
          userAvatar: '/default-avatar.png',
          content: '钟离先生的气质描写太棒了！特别是那种古老而深邃的感觉',
          createdAt: '2024-01-15T17:30:00Z',
          likes: 12,
          isLiked: false,
        },
        {
          id: 'comment-1-5',
          userId: 'user6',
          userName: '岩王帝君粉',
          userAvatar: '/default-avatar.png',
          content: '月光下的钟离真的太有魅力了，这段描写让我想到了很多往事',
          createdAt: '2024-01-15T18:00:00Z',
          likes: 7,
          isLiked: true,
        },
        {
          id: 'comment-1-6',
          userId: 'user7',
          userName: '小说爱好者',
          userAvatar: '/default-avatar.png',
          content: '文笔很好，情景描写很细腻，能感受到那种宁静的氛围',
          createdAt: '2024-01-15T19:15:00Z',
          likes: 4,
          isLiked: false,
        },
        {
          id: 'comment-1-7',
          userId: 'user8',
          userName: '夜行者',
          userAvatar: '/default-avatar.png',
          content: '建议可以再加一些背景音乐的描述，会更有代入感',
          createdAt: '2024-01-15T20:00:00Z',
          likes: 2,
          isLiked: false,
        },
        {
          id: 'comment-1-8',
          userId: 'user9',
          userName: '月夜读者',
          userAvatar: '/default-avatar.png',
          content: '这个故事让我想起了璃月港的那些传说，很有意境',
          createdAt: '2024-01-15T21:30:00Z',
          likes: 9,
          isLiked: true,
        }
      ],
      views: 1567,
      isFollowing: false,
    },
    {
      id: 2,
      author: '科技探索者',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-14T08:20:00Z',
      updatedAt: '2024-01-14T08:20:00Z',
      slug: 'tech-post',
      category: '科技',
      categorySlug: 'technology',
      readingTime: 8,
      title: 'AI技术发展趋势与未来展望',
      content: '人工智能技术正在以前所未有的速度发展，从机器学习到深度学习，从自然语言处理到计算机视觉...',
      tags: ['AI', '人工智能', '机器学习', '深度学习', '科技趋势', '未来展望', '技术发展', '创新', '数据科学', '算法', '神经网络', '自动化'],
      isLike: true,
      likes: 456,
      comments: 7,
      commentList: [
        {
          id: 'comment-2-1',
          userId: 'user5',
          userName: '码农小张',
          userAvatar: '/default-avatar.png',
          content: '很有见地的分析！AI确实是未来发展的重要方向',
          createdAt: '2024-01-14T10:00:00Z',
          likes: 3,
          isLiked: false,
        },
        {
          id: 'comment-2-2',
          userId: 'user6',
          userName: '数据分析师',
          userAvatar: '/default-avatar.png',
          content: '期待看到更多关于AI在各行业应用的案例分享',
          createdAt: '2024-01-14T11:30:00Z',
          likes: 1,
          isLiked: true,
        },
        {
          id: 'comment-2-3',
          userId: 'user10',
          userName: 'AI研究员',
          userAvatar: '/default-avatar.png',
          content: '深度学习的发展确实令人惊叹，但我觉得还需要关注AI的伦理问题',
          createdAt: '2024-01-14T12:00:00Z',
          likes: 15,
          isLiked: false,
        },
        {
          id: 'comment-2-4',
          userId: 'user11',
          userName: '产品经理',
          userAvatar: '/default-avatar.png',
          content: '从产品角度看，AI技术的商业化还有很长的路要走',
          createdAt: '2024-01-14T13:30:00Z',
          likes: 8,
          isLiked: true,
        },
        {
          id: 'comment-2-5',
          userId: 'user12',
          userName: '机器学习工程师',
          userAvatar: '/default-avatar.png',
          content: '自然语言处理这块发展特别快，GPT系列模型真的改变了很多东西',
          createdAt: '2024-01-14T14:45:00Z',
          likes: 22,
          isLiked: true,
        },
        {
          id: 'comment-2-6',
          userId: 'user13',
          userName: '计算机视觉专家',
          userAvatar: '/default-avatar.png',
          content: '计算机视觉在自动驾驶、医疗影像等领域的应用前景非常广阔',
          createdAt: '2024-01-14T15:20:00Z',
          likes: 11,
          isLiked: false,
        },
        {
          id: 'comment-2-7',
          userId: 'user14',
          userName: '创业者',
          userAvatar: '/default-avatar.png',
          content: '对于创业公司来说，如何利用AI技术创造价值是个关键问题',
          createdAt: '2024-01-14T16:10:00Z',
          likes: 5,
          isLiked: false,
        }
      ],
      views: 892,
      isFollowing: true,
    },
    {
      id: 3,
      author: '美食家小王',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-13T19:45:00Z',
      updatedAt: '2024-01-13T19:45:00Z',
      slug: 'food-post',
      category: '美食',
      categorySlug: 'food',
      readingTime: 5,
      title: '家常菜的温暖记忆',
      content: '每一道家常菜都承载着温暖的记忆，从小时候妈妈做的红烧肉，到现在自己学会的各种菜谱...',
      tags: ['美食', '家常菜', '烹饪', '记忆', '温暖'],
      isLike: false,
      likes: 123,
      comments: 0,
      commentList: [],
      views: 445,
      isFollowing: false,
    },
  ]);

  // 处理关注/取消关注
  const handleFollow = useCallback((userId: string) => {
    setPostList(prevPosts => 
      prevPosts.map(post => 
        post.author === userId 
          ? { ...post, isFollowing: !post.isFollowing }
          : post
      )
    );
  }, []);

  // 处理点赞/取消点赞
  const handleLike = useCallback((postId: number) => {
    setPostList(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLike: !post.isLike,
              likes: post.isLike ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  }, []);



  // 处理用户点击
  const handleUserClick = useCallback((userId: string) => {
    console.log('跳转到用户主页', userId);
    navigate(`/user/${userId}`);
  }, [navigate]);

  // 处理帖子点击
  const handlePostClick = useCallback((postId: number) => {
    console.log('跳转到帖子详情页', postId);
    navigate(`/post/${postId}`);
  }, [navigate]);

  // 处理标签点击
  const handleTagClick = useCallback((tag: string) => {
    console.log('跳转到标签专栏页', tag);
    navigate(`/tag/${encodeURIComponent(tag)}`);
  }, [navigate]);

  // 处理添加评论
  const handleAddComment = useCallback((postId: number, content: string) => {
    console.log('添加评论', postId, content);
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'currentUser',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPostList(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              commentList: [newComment, ...(post.commentList || [])],
              comments: (post.commentList?.length || 0) + 1
            }
          : post
      )
    );
  }, []);

  // 处理评论点赞
  const handleLikeComment = useCallback((commentId: string) => {
    console.log('点赞评论', commentId);
    setPostList(prevPosts => 
      prevPosts.map(post => ({
        ...post,
        commentList: post.commentList?.map(comment => 
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
              }
            : comment
        )
      }))
    );
  }, []);

  // 处理回复评论
  const handleReplyComment = useCallback((commentId: string, content: string) => {
    console.log('回复评论', commentId, content);
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      userId: 'currentUser',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPostList(prevPosts => 
      prevPosts.map(post => ({
        ...post,
        commentList: post.commentList?.map(comment => 
          comment.id === commentId
            ? {
                ...comment,
                replies: [newReply, ...(comment.replies || [])]
              }
            : comment
        )
      }))
    );
  }, []);

  // 处理举报
  const handleReport = useCallback((postId: number, type: 'post' | 'user') => {
    console.log(`举报${type}`, postId);
    alert(`您已举报该${type === 'post' ? '帖子' : '用户'}，我们将尽快处理`);
  }, []);

  // 处理屏蔽
  const handleBlock = useCallback((postId: number, type: 'post' | 'user') => {
    console.log(`屏蔽${type}`, postId);
    if (type === 'post') {
      setPostList(prevPosts => prevPosts.filter(post => post.id !== postId));
      alert('已屏蔽该帖子');
    } else {
      const post = postList.find(p => p.id === postId);
      if (post) {
        setPostList(prevPosts => prevPosts.filter(p => p.author !== post.author));
        alert(`已屏蔽用户 ${post.author}`);
      }
    }
  }, [postList]);

  // 处理取消关注
  const handleUnfollow = useCallback((userId: string) => {
    console.log('取消关注', userId);
    setPostList(prevPosts => 
      prevPosts.map(post => 
        post.author === userId 
          ? { ...post, isFollowing: false }
          : post
      )
    );
  }, []);



  return (
    <div className="grid grid-cols-1 gap-4">
      <PostArea />
      <div className="flex justify-end items-center mb-4 gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">最新</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">最热</button>
      </div>
      {postList.map((post) => (
        <FullPostCard 
          key={post.id} 
          post={post}
          onFollow={handleFollow}
          onLike={handleLike}
          onUserClick={handleUserClick}
          onPostClick={handlePostClick}
          onTagClick={handleTagClick}
          onReport={handleReport}
          onBlock={handleBlock}
          onUnfollow={handleUnfollow}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReplyComment={handleReplyComment}
        />
      ))}
    </div>
  );
}
