import { cn } from '@utils/cn';
import type { TagItem } from '@components/tag/tag.type.ts';

interface TagProps {
  tag: TagItem;
  className?: string;
  maxLength?: number;
}

export default function Tag(props: TagProps) {
  const { tag, className, maxLength } = props;
  
  // Format the tag name with truncation if needed
  const displayName = maxLength && tag.name.length > maxLength 
    ? `${tag.name.substring(0, maxLength)}...` 
    : tag.name;

  return (
    <a
      className={cn(
        'inline-flex text-gray-600 text-xs font-semibold px-1 py-0.5 rounded cursor-pointer transition-colors hover:underline hover:text-gray-800',
        className
      )}
      title={tag.name} // Show full name on hover
      style={tag.isPopular ? {
        backgroundImage: 'linear-gradient(45deg, rgb(255, 97, 206), rgb(124, 92, 255))',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }: {}}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">#{displayName}</span>
    </a>
  );
}
