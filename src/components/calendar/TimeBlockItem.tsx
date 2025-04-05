
import React, { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface TimeBlockItemProps {
  title: string;
  start: string;
  end: string;
  type: 'task' | 'event';
  completed?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

export function TimeBlockItem({
  title,
  start,
  end,
  type,
  completed,
  style,
  onClick,
}: TimeBlockItemProps) {
  return (
    <div 
      className={cn(
        "absolute left-1 right-1 rounded-md px-2 py-1 shadow-sm text-white overflow-hidden cursor-pointer pointer-events-auto",
        type === 'task' ? 'bg-app-indigo' : 'bg-app-orange',
        completed && 'opacity-60'
      )}
      style={style}
      onClick={onClick}
    >
      <div className="font-medium text-xs truncate">{title}</div>
      <div className="text-xs opacity-90">{start} - {end}</div>
    </div>
  );
}
