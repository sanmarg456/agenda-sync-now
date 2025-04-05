
import React from 'react';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClock, CheckCircle2, CircleEllipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onComplete, onEdit }: TaskCardProps) {
  const priorityClass = `priority-${task.priority}`;
  
  return (
    <Card className={`task-card mb-3 ${priorityClass} ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => onComplete(task.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <CircleEllipsis className="h-4 w-4" />
            </Button>
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
              {task.category}
            </span>
            
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium">
                <CalendarClock className="h-3 w-3" />
                {formatDistanceToNow(task.dueDate, { addSuffix: true })}
              </span>
            )}
            
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium">
              {task.duration} min
            </span>
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">
                {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
