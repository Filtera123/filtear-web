import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '@/components/comment/CommentSection';
import type { DynamicPost } from '@/components/post-card/post.types';
import { usePostActions } from '@/hooks/usePostActions';
import { useBrowsingHistoryStore } from '@/stores/browsingHistoryStore';
import DetailPageHeader from '@/components/layout/DetailPageHeader';
import Tag from '@/components/tag/Tag';

export default function DynamicDetail() {
  const getImageGridClass = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  };
  const location = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { id } = useParams();
  const post = location.state?.post as (DynamicPost & { scrollToComments?: boolean }) | undefined;
  const navigate = useNavigate();
  const { addRecord } = useBrowsingHistoryStore();

  const [showCommentSection, setShowCommentSection] = useState(true); // 修改：详情页默认展开评论区
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // 记录浏览历史
  useEffect(() => {
    if (post) {
      addRecord({
        id: post.id,
        title: post.content ? (post.content.slice(0, 30) + (post.content.length > 30 ? '...' : '')) : '动态内容',
        author: post.author,
        authorAvatar: post.authorAvatar,
        type: 'dynamic',
        url: `/post/dynamic/${post.id}`,
        thumbnail: post.images?.[0]?.url,
      });
    }
  }, [post?.id]); // 只依赖 post.id，避免重复添加

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
  if (!post) {
    return <div className="text-center py-20">Not Found</div>;
  }

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
  } = usePostActions(post);

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
          <button
            onClick={() => {
              setShowCommentSection(true);
              document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-gray-600 hover:text-blue-500 text-xl"
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
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    handleReportPost();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报帖子
                </button>
                <button
                  onClick={() => {
                    handleBlockPost();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽帖子
                </button>
                {isFollowing && (
                  <button
                    onClick={() => {
                      handleUnfollow();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    取消关注
                  </button>
                )}
                <button
                  onClick={() => {
                    handleBlockUser();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  屏蔽用户
                </button>
                <button
                  onClick={() => {
                    handleReportUser();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  举报用户
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 主体区域 */}
        <main className="w-full max-w-3xl bg-white px-6 py-8 shadow-sm rounded">
          {/* 标题 */}
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}>{post.title}</h1>

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
                className="ml-4 px-2 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
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
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {post.tags.map((tag) => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          <div className="text-base leading-relaxed space-y-4 text-gray-800" style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}>
            {post.content.split('\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          {/* 图片展示 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              <div
                className={`grid gap-2 ${
                  post.images.length === 1
                    ? 'grid-cols-1'
                    : post.images.length === 2
                      ? 'grid-cols-2'
                      : post.images.length === 4
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                }`}
              >
                {post.images.slice(0, 9).map((image, index) => {
                  const isLastItem = index === 8 && post.images && post.images.length > 9;
                  const remainingCount = post.images ? post.images.length - 9 : 0;

                  return (
                    <div
                      key={index}
                      className={`relative rounded-lg overflow-hidden bg-gray-100 hover:opacity-95 transition-opacity ${
                        post.images && post.images.length === 1 ? 'aspect-[4/3]' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${post.title} - 配图 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/fallback-image.png'; // 默认图
                        }}
                      />

                      {/* 最后一张+剩余数量 */}
                      {isLastItem && remainingCount > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-lg font-medium">+{remainingCount}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 图片数量提示 */}
              {post.images.length > 1 && (
                <div className="flex items-center justify-between mt-2 text-gray-500 text-xs">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>共 {post.images.length} 张图片</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {showCommentSection && (
            <div id="comment-section" className="mt-8">
              <CommentSection 
                postId={post.id} 
                comments={post.commentList || []} 
                showAllComments={true}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
