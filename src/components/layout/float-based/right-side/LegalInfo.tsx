import { Link } from 'react-router-dom';

export default function LegalInfo() {
  return (
    <div className="text-xs text-gray-500 mt-4 mb-4"> {/* 将 mt-0 改为 mt-4 */}
      <p className="font-medium mb-1 text-gray-700">平台法律信息</p>
      {/* 添加ICP和公安备案号 */}
      <p className="mb-2">
        <span>ICP备案号: 京ICP备12345678号-1</span>
        <span className="ml-2">公安备案号: 京公网安备11010102000001号</span>
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Link to="/terms" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>用户协议</Link>
        <Link to="/privacy" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>隐私政策</Link>
        <Link to="/contact" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>联系我们</Link>
        <Link to="/community" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>社区规则</Link>
        <Link to="/official-account" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>官方账号</Link>
        <Link to="/copyright" className="hover:opacity-80 transition-colors" 
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}>版权声明</Link>
      </div>
    </div>
  );
}