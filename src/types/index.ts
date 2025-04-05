
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  duration: number; // in minutes
  subtasks?: Subtask[];
  timeBlock?: TimeBlock;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimeBlock {
  start: Date;
  end: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  notes?: string;
  taskId?: string; // Optional reference to a task
}

export interface DailyPlan {
  date: Date;
  tasks: Task[];
  events: CalendarEvent[];
  suggestedTimeBlocks: Map<string, TimeBlock>; // taskId -> timeBlock
}
