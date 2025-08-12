import { useEffect, useRef, useState } from 'react';
import { Popover } from '@chakra-ui/react';
import type { ArticlePost } from '@components/post-card/post.types';
import type { BasePost } from '@components/post-card/post.types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '@/components/comment/CommentSection';
import { useCommentStore } from '@/components/comment/Comment.store';
import { usePostActions } from '@/hooks/usePostActions';
import { useBrowsingHistoryStore } from '@/stores/browsingHistoryStore';
import DetailPageHeader from '@/components/layout/DetailPageHeader';
import Tag from '@/components/tag/Tag';
import { getSimpleLocation } from '@/utils/ipLocation';
import { useReportContext } from '@/components/report';

// 在文件顶部添加 mock 数据
const mockArticles = [
  {
    id: 'nihao',
    type: 'article' as const,
    title: 'nihao 文章',
    content: '这是一篇关于nihao的文章...\n正文内容示例。',
    author: '测试作者',
    authorAvatar: 'https://example.com/avatar1.jpg',
    authorIpLocation: '北京',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    slug: 'nihao',
    summary: 'nihao 文章摘要',
    category: '默认分类',
    categorySlug: 'default',
    tags: [{ id: 'ni', name: 'ni' }],
    wordCount: 100,
    likes: 10,
    isLike: false,
    isFollowing: false,
    comments: 5,
    commentList: [],
    views: 100,
    abstract: 'nihao 文章摘要',
  },
  {
    id: 'ninjago',
    type: 'article' as const,
    title: 'ninjago 文章',
    content: '这是一篇关于ninjago的文章...\n正文内容示例。',
    author: '忍者作者',
    authorAvatar: 'https://example.com/avatar2.jpg',
    authorIpLocation: '上海',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    slug: 'ninjago',
    summary: 'ninjago 文章摘要',
    category: '默认分类',
    categorySlug: 'default',
    tags: [{ id: 'ninja', name: 'ninja' }],
    wordCount: 120,
    likes: 20,
    isLike: false,
    isFollowing: false,
    comments: 8,
    commentList: [],
    views: 200,
    abstract: 'ninjago 文章摘要',
  },
  {
    id: 'mbti',
    type: 'article' as const,
    title: 'MBTI测试',
    content: '这是一篇关于MBTI测试的文章...\n正文内容示例。',
    author: 'MBTI作者',
    authorAvatar: 'https://example.com/avatar3.jpg',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    slug: 'mbti',
    summary: 'MBTI 文章摘要',
    category: '默认分类',
    categorySlug: 'default',
    tags: [{ id: 'MBTI', name: 'MBTI' }],
    wordCount: 80,
    likes: 5,
    isLike: false,
    isFollowing: false,
    comments: 2,
    commentList: [],
    views: 50,
    abstract: 'MBTI 文章摘要',
  },
];

export default function ArticleDetail() {
  const { state } = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  let post = state as (ArticlePost & { scrollToComments?: boolean }) | undefined;
  if (!post && postId) {
    post = mockArticles.find(a => a.id === postId);
  }
  // 始终调用 hook，哪怕 post 可能为 undefined
  const postActions = usePostActions(post || ({} as BasePost));
  const [showCommentSection, setShowCommentSection] = useState(true); // 修改：详情页默认展开评论区
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { addRecord } = useBrowsingHistoryStore();
  const { openReportModal } = useReportContext();
  const { comments: storeComments, setComments, addComment, addReply, toggleCommentLike } = useCommentStore();

  // 记录浏览历史
  useEffect(() => {
    if (post) {
      addRecord({
        id: post.id,
        title: post.title || '无标题文章',
        author: post.author,
        authorAvatar: post.authorAvatar,
        type: 'article',
        url: `/post/article/${post.id}`,
      });
    }
  }, [post?.id]); // 只依赖 post.id，避免重复添加

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 检查是否需要自动滚动到评论区
  useEffect(() => {
    if (post?.scrollToComments) {
      setShowCommentSection(true);
      // 使用setTimeout确保CommentSection已渲染
      setTimeout(() => {
        const commentSection = document.getElementById('comment-section');
        if (commentSection) {
          commentSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [post?.scrollToComments]);

  // 初始化评论数据到store
  useEffect(() => {
    if (post?.commentList && !storeComments[post.id]) {
      setComments(post.id, post.commentList);
    }
  }, [post?.commentList, post?.id, storeComments, setComments]);

  if (!post) {
    return <div className="text-center py-20">Not Found</div>;
  }

  // 获取当前帖子的评论数据（优先使用store中的数据）
  const currentComments = storeComments[post.id] || post.commentList || [];

  // CommentSection的回调函数
  const handleCommentAdd = (postId: string, content: string) => {
    console.log('添加评论到文章:', postId, content);
    
    // 创建新评论对象
    const newComment = {
      id: Date.now().toString(),
      userId: 'current_user_id',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      userIpLocation: '上海',
      content: content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    // 添加评论到store
    addComment(postId, newComment);
    console.log('文章评论已添加:', newComment);
  };

  const handleCommentLikeClick = (commentId: string) => {
    console.log('点赞评论:', commentId);
    // 使用store更新评论点赞状态
    toggleCommentLike(post.id, commentId);
  };

  const handleCommentReplySubmit = (commentId: string, content: string) => {
    console.log('回复评论:', commentId, content);
    
    // 创建新回复对象
    const newReply = {
      id: Date.now().toString() + '_reply',
      userId: 'current_user_id',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      userIpLocation: '上海',
      content: content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    // 添加回复到store
    addReply(post.id, commentId, newReply);
    console.log('文章详情页回复已添加:', newReply);
  };

  const handleCommentUserClick = (userId: string) => {
    console.log('点击用户:', userId);
    // TODO: 实现用户页面跳转
  };

  const handleCommentBlock = (commentId: string) => {
    console.log('屏蔽评论:', commentId);
    // TODO: 实现评论屏蔽逻辑
  };

  const handleCommentReport = (commentId: string) => {
    console.log('举报评论:', commentId);
    // TODO: 实现评论举报逻辑
  };

  const handleCommentUserBlock = (userId: string) => {
    console.log('屏蔽用户:', userId);
    // TODO: 实现用户屏蔽逻辑
  };
  // 解构 postActions
  const {
    likes,
    isLike,
    handleLike,
    isFollowing,
    handleFollow,
    handleUnfollow,
    handleUserClick,
    handleBlockUser,
    handleReportUser,
    handleBlockPost,
    handleReportPost,
    comments,
    views,
    formatNumber,
  } = postActions;
  return (
    <>
      {/* 导航栏 */}
      <DetailPageHeader />

      <div className="flex justify-center px-4 py-10 bg-gray-50">
        {/* 左侧 */}
        <aside className="hidden lg:flex flex-col items-center space-y-4 fixed top-32 left-[calc(50%-384px-48px)]">
          {/* 点赞 */}
          <button
            onClick={handleLike}
            className={`text-xl transition-colors ${
              isLike ? 'text-red-500' : 'text-red-600 hover:text-red-500'
            }`}
          >
            {isLike ? (
              <svg className="w-6 h-6 fill-red-500" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
          <span className="text-sm text-gray-600">{formatNumber(likes)}</span>

          {/* 评论 */}
          <button
            onClick={() => {
              setShowCommentSection(true);
              document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-gray-600 hover:opacity-80 text-xl transition-opacity"
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#4b5563'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-600">{formatNumber(comments)}</span>

          {/* 浏览量 */}
          <div className="text-gray-600 text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600">{formatNumber(views)}</span>
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 w-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {isFollowing && (
                  <button
                    onClick={() => {
                      handleUnfollow();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    取消关注
                  </button>
                )}
                <button
                  onClick={() => {
                    handleBlockPost();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽帖子
                </button>
                <button
                  onClick={() => {
                    handleBlockUser();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽用户
                </button>
                <button
                  onClick={() => {
                    openReportModal(post.id, 'post', post.author);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 主体区域 */}
        <main className="w-full max-w-3xl bg-white px-6 py-8 shadow-sm rounded">
          {/* 返回与主页 */}

          {/* 标题 */}
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif" }}>{post.title}</h1>

          {/* 作者信息 */}
          <div className="flex items-center justify-center mb-2">
            <img
              src={post.authorAvatar}
              alt="作者头像"
              className="w-10 h-10 rounded-full mr-2 cursor-pointer"
              onClick={handleUserClick}
            />
            <div className="flex flex-col items-center cursor-pointer" onClick={handleUserClick}>
              <span className="font-semibold">{post.author}</span>
            </div>
            {!isFollowing ? (
              <button
                onClick={handleFollow}
                className="ml-4 px-2 py-1 text-sm rounded hover:opacity-90 transition-opacity"
                style={{ color: '#7E44C6', borderColor: '#7E44C6' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f3f0ff'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                + 关注
              </button>
            ) : (
              <button
                onClick={handleUnfollow}
                className="ml-4 px-2 py-1 text-sm text-gray-500 border border-gray-300 rounded"
              >
                已关注
              </button>
            )}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {post.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>

          {/* 引言/摘要（如果有） */}
          {post.abstract && (
            <>
              {/* 引言上方横线 */}
              <hr className="border-gray-200 mb-6" />
              
              <blockquote className="border-l-4 pl-4 text-gray-700 italic mb-8 font-italic" style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif", borderLeftColor: '#7E44C6' }}>
                {post.abstract}
              </blockquote>
              
              {/* 引言下方横线 */}
              <hr className="border-gray-200 mb-6" />
            </>
          )}

          {/* 正文 */}
          <div className="text-base leading-relaxed space-y-4 text-gray-800" style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif" }}>
            {post.content.split('\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          {/* 字数提示 */}
          <div className="mt-8 text-xs text-gray-400 text-left">全文 {post.wordCount} 字</div>
          
          {/* IP地址 */}
          {post.authorIpLocation && (
            <div className="mt-4 text-xs text-gray-400 text-left">
              {getSimpleLocation(post.authorIpLocation)}
            </div>
          )}
          
          {showCommentSection && (
            <div id="comment-section" className="mt-8">
              <CommentSection 
                postId={post.id} 
                comments={currentComments} 
                showAllComments={true}
                onAddComment={handleCommentAdd}
                onLikeComment={handleCommentLikeClick}
                onReplyComment={handleCommentReplySubmit}
                onUserClick={handleCommentUserClick}
                onBlockComment={handleCommentBlock}
                onReportComment={handleCommentReport}
                onBlockUser={handleCommentUserBlock}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
