import { cn } from '@utils/cn';
import type { TagItem } from '@components/tag/tag.type.ts';

interface TagProps {
  tag: TagItem;
  className?: string;
}

export default function Tag(props: TagProps) {
  const { tag, className } = props;

  return (
    <a
      className={cn(
        'inline-flex text-gray-600 text-xs font-semibold px-1 py-0.5 rounded cursor-pointer transition-colors hover:underline hover:text-gray-800',
        className
      )}
      style={tag.isPopular ? {
        backgroundImage: 'linear-gradient(45deg, rgb(255, 97, 206), rgb(124, 92, 255))',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }: {}}
    >

      <span>#{tag.name}</span>
    </a>
  );
}
