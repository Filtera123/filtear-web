import { useLocation, useParams } from 'react-router-dom';
import type { ArticlePost } from '@components/post-card/post.types';

export default function ArticleDetail() {
  const { state } = useLocation();
  const { id } = useParams();

  const post = state as ArticlePost | undefined;

  if (!post) {
    return <div className="text-center py-20">Not Found</div>;
  }

  return (
    <main className="flex justify-center px-4 py-10">
      <article className="w-full max-w-3xl bg-white p-6">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center mb-2">{post.title}</h1>

        {/* 作者 */}
        <p className="text-center text-gray-500 mb-4">by AlexYYYY</p>

        {/* 分隔线 */}
        <hr className="my-6 border-t border-gray-300" />

        {/* 正文内容 */}
        <div className="text-base leading-relaxed space-y-4 text-gray-800">
          {post.content.split('\n').map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}