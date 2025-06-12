import { FullPostCard } from './../../components/post-card';
import PostArea from './PostArea';

export default function MySubscriptionsList() {
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
      <div className="flex justify-end items-center mb-4 gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">最新</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">最热</button>
      </div>
      {postList.map((post) => (
        <FullPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
