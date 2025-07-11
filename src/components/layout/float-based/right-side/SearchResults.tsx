import React from 'react';
import { useParams } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const { query } = useParams(); // 获取查询参数

  return (
    <div>
      <h1>搜索结果：{query}</h1>
      {/* 处理并显示相关的搜索结果 */}
      <div>
        {/* 示例结果 */}
        <p>显示关于“{query}”的相关内容。</p>
      </div>
    </div>
  );
};

export default SearchResults;
