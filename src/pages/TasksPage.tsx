import React, { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { taskService } from '@/services/taskService';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await taskService.updateTask(taskId, {
        completed: !task.completed
      });

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, completed: !t.completed };
        }
        return t;
      }));
      
      toast({
        title: "Task updated",
        description: "Task marked as complete",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitTask = async (data: Partial<Task>) => {
    try {
      if (data.id) {
        // Update existing task
        const updatedTask = await taskService.updateTask(data.id, data);
        setTasks(prev => prev.map(task => {
          if (task.id === data.id) {
            return updatedTask;
          }
          return task;
        }));
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully",
        });
      } else {
        // Create new task
        const newTask = await taskService.createTask({
          ...data as Omit<Task, 'id'>,
          completed: false,
          subtasks: [],
        });
        
        setTasks(prev => [newTask, ...prev]);
        
        toast({
          title: "Task created",
          description: "Your new task has been created successfully",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <div className="text-center">Loading tasks...</div>
      </div>
    );
  }
  
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
