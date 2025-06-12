import { FullPostCard } from './../../components/post-card';
import PostArea from './PostArea';

export default function RecommendedPost() {
  const postList = [
    {
      id: 1,
      author: 'John Doe',
      authorAvatar: 'https://example.com/avatar.jpg',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-02',
      slug: 'sample-post',
      category: 'Technology',
      categorySlug: 'technology',
      readingTime: 5,
      title: 'Sample Post',
      content: 'This is a sample post content.',
      tags: ['tag1', 'tag2'],
      isLike: true,
      likes: 10,
      isFavorite: true,
      comments: 5,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <PostArea />

      {postList.map((post) => (
        <FullPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
