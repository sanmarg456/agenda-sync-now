
import React, { useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample data
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete project proposal',
    description: 'Finish the draft and send it to the team for review',
    category: 'work',
    priority: 'high',
    dueDate: new Date(new Date().setHours(23, 59, 59)),
    completed: false,
    duration: 60,
  },
  {
    id: uuidv4(),
    title: 'Grocery shopping',
    description: 'Buy fruits, vegetables, and other essentials',
    category: 'personal',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    duration: 30,
  },
  {
    id: uuidv4(),
    title: 'Morning workout',
    description: '30 minutes of cardio and strength training',
    category: 'health',
    priority: 'low',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    completed: false,
    duration: 45,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();
  
  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };
  
  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
    
    toast({
      title: "Task updated",
      description: "Task marked as complete",
    });
  };
  
  const handleSubmitTask = (data: Partial<Task>) => {
    if (data.id) {
      // Update existing task
      setTasks(prev => prev.map(task => {
        if (task.id === data.id) {
          return { ...task, ...data };
        }
        return task;
      }));
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...data as Omit<Task, 'id'>,
        id: uuidv4(),
        completed: false,
        subtasks: [],
      };
      
      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      <TaskList
        tasks={tasks}
        onComplete={handleCompleteTask}
        onEdit={handleEditTask}
        onAdd={handleAddTask}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={currentTask}
            onSubmit={handleSubmitTask}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
