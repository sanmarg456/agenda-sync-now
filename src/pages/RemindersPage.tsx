
import React, { useState } from 'react';
import { ReminderList } from '@/components/reminders/ReminderList';
import { useToast } from '@/hooks/use-toast';
import { Task, CalendarEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

// Sample data
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Submit quarterly report',
    description: 'Prepare and submit the Q3 financial report',
    category: 'work',
    priority: 'high',
    dueDate: addDays(new Date(), 2),
    completed: false,
    duration: 120,
  },
  {
    id: uuidv4(),
    title: 'Doctor\'s appointment',
    description: 'Annual checkup',
    category: 'health',
    priority: 'medium',
    dueDate: addDays(new Date(), 5),
    completed: false,
    duration: 60,
  },
];

const initialEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: 'Team Building Event',
    start: addDays(new Date(new Date().setHours(13, 0, 0, 0)), 3),
    end: addDays(new Date(new Date().setHours(17, 0, 0, 0)), 3),
    notes: 'Outdoor activities and dinner',
  },
  {
    id: uuidv4(),
    title: 'Product Demo',
    start: addDays(new Date(new Date().setHours(11, 0, 0, 0)), 1),
    end: addDays(new Date(new Date().setHours(12, 0, 0, 0)), 1),
    notes: 'Present new features to the client',
  },
];

export default function RemindersPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const { toast } = useToast();
  
  const handleAddReminder = () => {
    // This would typically open a form to add a new reminder
    // For demonstration, we'll just show a toast
    toast({
      title: "Add Reminder",
      description: "This feature will be implemented in a future update.",
    });
  };
  
  const handleSnoozeReminder = (type: 'task' | 'event', id: string) => {
    if (type === 'task') {
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const newDueDate = addDays(task.dueDate || new Date(), 1);
          return { ...task, dueDate: newDueDate };
        }
        return task;
      }));
      
      toast({
        title: "Reminder snoozed",
        description: "Task reminder snoozed for 1 day",
      });
    } else {
      setEvents(prev => prev.map(event => {
        if (event.id === id) {
          const daysDiff = 1;
          const newStart = addDays(new Date(event.start), daysDiff);
          const newEnd = addDays(new Date(event.end), daysDiff);
          return { ...event, start: newStart, end: newEnd };
        }
        return event;
      }));
      
      toast({
        title: "Reminder snoozed",
        description: "Event reminder snoozed for 1 day",
      });
    }
  };
  
  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    }));
    
    toast({
      title: "Task completed",
      description: "The task has been marked as complete",
    });
  };
  
  return (
    <div className="container mx-auto">
      <ReminderList
        tasks={tasks}
        events={events}
        onAddReminder={handleAddReminder}
        onSnoozeReminder={handleSnoozeReminder}
        onCompleteTask={handleCompleteTask}
      />
    </div>
  );
}
