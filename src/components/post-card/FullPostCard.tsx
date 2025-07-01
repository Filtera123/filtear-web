import Tag from '../Tag';

interface PostItem {
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
  isFavorite: boolean;
  comments: number;
}

interface Props {
  post: PostItem;
}

export default function FullPostCard(props: Props) {
  const { post } = props;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{post.author}</h3>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">{post.readingTime} min read</span>
          <span className="text-sm text-gray-500">{post.likes} Likes</span>
          <span className="text-sm text-gray-500">{post.comments} Comments</span>
        </div>
        <div className="">
          <span className="text-sm text-gray-500">
            {post.isFavorite ? '⭐ Favorited' : '☆ Favorite'}
          </span>
        </div>
      </div>
    </div>
  );
}
