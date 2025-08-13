import { Link } from 'react-router-dom';
import dongtaiIcon from '../../assets/icons/dongtai.png';
import tupianIcon from '../../assets/icons/tupian.png';
import shipinIcon from '../../assets/icons/shipin.png';
import wenzhangIcon from '../../assets/icons/wenzhang.png';

export default function PostArea() {
  return (
    <div className="flex justify-center gap-12 bg-white p-4 border border-gray-200 border-t-0">
      <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-purple-50 transition-colors group">
        <img src={dongtaiIcon} alt="动态" className="w-12 h-12 object-contain" />
        <span className="text-base font-medium text-gray-700 group-hover:text-purple-600">动态</span>
      </button>
      
      <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-purple-50 transition-colors group">
        <img src={tupianIcon} alt="图片" className="w-12 h-12 object-contain" />
        <span className="text-base font-medium text-gray-700 group-hover:text-purple-600">图片</span>
      </button>
      
      <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-purple-50 transition-colors group">
        <img src={shipinIcon} alt="视频" className="w-12 h-12 object-contain" />
        <span className="text-base font-medium text-gray-700 group-hover:text-purple-600">视频</span>
      </button>
      
      <Link
        to="/editor/user/normal"
        className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
      >
        <img src={wenzhangIcon} alt="长文章" className="w-12 h-12 object-contain" />
        <span className="text-base font-medium text-gray-700 group-hover:text-purple-600">长文章</span>
      </Link>
    </div>
  );
}
