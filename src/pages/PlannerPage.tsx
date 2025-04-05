
import React, { useState } from 'react';
import { DailyPlanner } from '@/components/planner/DailyPlanner';
import { useToast } from '@/hooks/use-toast';
import { Task, CalendarEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

// Sample data
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Review project documentation',
    description: 'Go through recent changes and leave comments',
    category: 'work',
    priority: 'high',
    dueDate: new Date(),
    completed: false,
    duration: 45,
  },
  {
    id: uuidv4(),
    title: 'Call insurance company',
    description: 'Discuss policy renewal options',
    category: 'personal',
    priority: 'medium',
    dueDate: new Date(),
    completed: false,
    duration: 20,
  },
  {
    id: uuidv4(),
    title: 'Prepare presentation slides',
    description: 'Create slides for tomorrow\'s meeting',
    category: 'work',
    priority: 'high',
    dueDate: new Date(),
    completed: false,
    duration: 60,
  },
];

const initialEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: 'Team Standup',
    start: new Date(new Date().setHours(9, 30, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    notes: 'Daily team check-in',
  },
];

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const { toast } = useToast();
  
  const handleAcceptTask = (taskId: string, start: Date, end: Date) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          timeBlock: { start, end },
        };
      }
      return task;
    }));
    
    toast({
      title: "Task scheduled",
      description: "The task has been added to your calendar",
    });
  };
  
  const handleSnoozeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          dueDate: addDays(new Date(), 1), // Snooze to tomorrow
        };
      }
      return task;
    }));
    
    toast({
      title: "Task snoozed",
      description: "The task has been snoozed until tomorrow",
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list",
    });
  };
  
  const handleGeneratePlan = () => {
    // This would typically involve a more complex algorithm
    // For demonstration, we'll just generate time blocks for tasks without them
    let currentStartTime = new Date();
    currentStartTime.setHours(9, 0, 0, 0); // Start at 9 AM
    
    const updatedTasks = tasks.map(task => {
      if (!task.completed && !task.timeBlock) {
        const newStartTime = new Date(currentStartTime);
        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newStartTime.getMinutes() + (task.duration || 30));
        
        // Update start time for next task
        currentStartTime = new Date(newEndTime);
        currentStartTime.setMinutes(currentStartTime.getMinutes() + 15); // 15 min break
        
        return {
          ...task,
          timeBlock: {
            start: newStartTime,
            end: newEndTime,
          },
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    toast({
      title: "Daily plan generated",
      description: "Your tasks have been scheduled for today",
    });
  };
  
  return (
    <div className="container mx-auto">
      <DailyPlanner
        tasks={tasks}
        events={events}
        onAcceptTask={handleAcceptTask}
        onSnoozeTask={handleSnoozeTask}
        onDeleteTask={handleDeleteTask}
        onGeneratePlan={handleGeneratePlan}
      />
    </div>
  );
}
