
import React, { useState } from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onAdd: () => void;
}

type FilterType = 'all' | 'today' | 'upcoming' | 'completed';

export function TaskList({ tasks, onComplete, onEdit, onAdd }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'today') {
      return task.dueDate && 
        new Date(task.dueDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) && 
        !task.completed;
    }
    if (filter === 'upcoming') {
      const today = new Date().setHours(0, 0, 0, 0);
      return task.dueDate && 
        new Date(task.dueDate).setHours(0, 0, 0, 0) > today && 
        !task.completed;
    }
    // 'all' filter but exclude completed
    return !task.completed;
  });
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by due date</DropdownMenuItem>
              <DropdownMenuItem>Sort by priority</DropdownMenuItem>
              <DropdownMenuItem>Group by category</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div>
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <Check className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === 'completed' 
                ? "You haven't completed any tasks yet."
                : filter === 'today'
                ? "No tasks due today. Enjoy your free time!"
                : filter === 'upcoming'
                ? "No upcoming tasks. Plan ahead!"
                : "Get started by adding a new task."}
            </p>
            <Button onClick={onAdd} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        ) : (
          <div>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onComplete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
