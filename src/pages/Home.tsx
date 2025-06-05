import { useState } from 'react';
import { Button } from '@mui/material';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          欢迎使用现代 React 应用
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-pretty">
          基于 React + TypeScript + Vite + TailwindCSS v4 构建的现代化应用架构
        </p>
      </div>

      <div className="card w-full max-w-md p-6 text-center">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">当前计数</p>
            <p className="text-3xl font-bold tabular-nums text-primary-600">{count}</p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={() => setCount(count + 1)} className="flex-1 overflow-hidden">
              增加 (+1)
            </Button>
            <Button onClick={() => setCount(count - 1)} className="flex-1 overflow-hidden">
              减少 (-1)
            </Button>
          </div>

          <Button onClick={() => setCount(0)} size="small" className="w-full overflow-hidden">
            重置计数器
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full max-w-4xl">
        {[
          { title: 'React 18', desc: '现代化的 React 框架' },
          { title: 'TypeScript', desc: '类型安全的开发体验' },
          { title: 'Vite', desc: '极速的构建工具' },
          { title: 'TailwindCSS v4', desc: '下一代 CSS 框架' },
        ].map((item, index) => (
          <div key={index} className="card p-4 text-center space-y-2">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
