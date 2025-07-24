import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface MasonryLayoutProps {
  children: ReactNode;
  columns?: {
    default: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export default function MasonryLayout({ 
  children, 
  columns = { default: 2, md: 3, lg: 4, xl: 5 },
  gap = '1rem',
  className = ''
}: MasonryLayoutProps) {
  const columnClasses = {
    1: 'columns-1',
    2: 'columns-2', 
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
    6: 'columns-6'
  };

  const responsiveClasses = [
    columnClasses[columns.default] || 'columns-2',
    columns.md ? `md:${columnClasses[columns.md]}` : '',
    columns.lg ? `lg:${columnClasses[columns.lg]}` : '',
    columns.xl ? `xl:${columnClasses[columns.xl]}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cn(
        'w-full',
        responsiveClasses,
        className
      )}
      style={{ 
        columnGap: gap,
        columnFill: 'balance'
      }}
    >
      {children}
    </div>
  );
} 