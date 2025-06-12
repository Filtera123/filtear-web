import { cn } from '@utils/cn';

interface TagProps {
  tag: string;
  className?: string;
}

export default function Tag(props: TagProps) {
  const { tag, className } = props;

  return (
    <span
      className={cn(
        'inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2 mb-2',
        className
      )}
    >
      <span> #{tag}</span>
    </span>
  );
}
