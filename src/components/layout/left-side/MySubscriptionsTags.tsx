import { div } from 'framer-motion/client';
import { Tag } from '../../index';

export default function MySubscriptionTags() {
  const tags = [
    { name: '前端', color: 'blue' },
    { name: '后端', color: 'green' },
    { name: '全栈', color: 'purple' },
    { name: 'AI', color: 'red' },
    { name: '云计算', color: 'orange' },
  ];

  return (
    <div className="bg-white p-4 rounded-b-sm">
      <h1 className="text-lg font-semibold mb-4">我的标签</h1>
      <div className="flex flex-col gap-2">
        {tags.map((tag) => (
          <div className="flex justify-between" key={tag.name}>
            <Tag className="text-base" tag={tag.name} /> <span>12.3k</span>
          </div>
        ))}
      </div>
    </div>
  );
}
