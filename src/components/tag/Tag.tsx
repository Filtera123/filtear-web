import { cn } from '@utils/cn';
import { useNavigate } from 'react-router-dom';
import type { TagItem } from '@components/tag/tag.type.ts';

interface TagProps {
  tag: TagItem;
  className?: string;
  maxLength?: number;
}

export default function Tag(props: TagProps) {
  const { tag, className, maxLength } = props;
  const navigate = useNavigate();
  
  // Format the tag name with truncation if needed
  const displayName = maxLength && tag.name.length > maxLength 
    ? `${tag.name.substring(0, maxLength)}...` 
    : tag.name;

  // Handle tag click to navigate to tag page
  const handleTagClick = () => {
    navigate(`/tag/${encodeURIComponent(tag.name)}`);
  };

  return (
    <a
      className={cn(
        'inline-flex text-black text-xs font-semibold px-1 py-0.5 rounded cursor-pointer transition-colors hover:underline hover:text-gray-700',
        className
      )}
      title={tag.name} // Show full name on hover
      onClick={handleTagClick}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">#{displayName}</span>
    </a>
  );
}
