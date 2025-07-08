import { useNavigate } from 'react-router-dom';
import { Tag } from '../../../index';

export default function MySubscriptionTags() {
  const navigate = useNavigate();
  const tags = [
    { name: '前端', color: 'blue' },
    { name: '后端', color: 'green' },
    { name: '全栈', color: 'purple' },
    { name: 'AI', color: 'red' },
    { name: '云计算', color: 'orange' },
    { name: '大数据', color: 'indigo' },
    { name: '区块链', color: 'teal' },
    { name: '移动开发', color: 'pink' },
    { name: 'UI/UX', color: 'amber' },
    { name: '测试', color: 'emerald' },
    { name: 'DevOps', color: 'slate' },
    { name: '网络安全', color: 'rose' },
    { name: '游戏开发', color: 'violet' },
    { name: '嵌入式', color: 'lime' },
    { name: '数据分析', color: 'sky' },
    { name: '机器学习', color: 'fuchsia' },
    { name: '深度学习', color: 'cyan' },
    { name: '自然语言处理', color: 'amber' },
    { name: '计算机视觉', color: 'emerald' },
    { name: '强化学习', color: 'rose' },
  ];

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    navigate(`/tag/${encodeURIComponent(tagName)}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-base font-semibold">我的订阅</h1>
        <button
          onClick={() => console.log('打开设置')}
          className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
        {tags.map((tag) => (
          <div className="flex justify-between items-center" key={tag.name}>
            <div onClick={() => handleTagClick(tag.name)} className="cursor-pointer">
              <Tag className="text-xs py-1 px-2" tag={tag} />
            </div>
            <span className="text-xs text-gray-500">+12.3k</span>
          </div>
        ))}
      </div>
    </div>
  );
}
