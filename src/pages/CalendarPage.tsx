
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventForm } from '@/components/calendar/EventForm';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Task, CalendarEvent } from '@/types';
import { addMonths, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Sample data
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Team meeting',
    description: 'Weekly team sync',
    category: 'work',
    priority: 'medium',
    dueDate: new Date(),
    completed: false,
    duration: 60,
    timeBlock: {
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
    }
  },
];

const initialEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: 'Client Presentation',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    notes: 'Present the new project proposal to the client',
  },
];

type DialogType = 'task' | 'event' | null;

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | undefined>(undefined);
  const { toast } = useToast();
  
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const handleAddTask = () => {
    setCurrentTask(undefined);
    setDialogType('task');
  };
  
  const handleAddEvent = () => {
    setCurrentEvent(undefined);
    setDialogType('event');
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setDialogType('task');
  };
  
  const handleEditEvent = (event: CalendarEvent) => {
    setCurrentEvent(event);
    setDialogType('event');
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
      
      setTasks(prev => [...prev, newTask]);
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully",
      });
    }
    
    setDialogType(null);
  };
  
  const handleSubmitEvent = (data: Partial<CalendarEvent>) => {
    if (data.id) {
      // Update existing event
      setEvents(prev => prev.map(event => {
        if (event.id === data.id) {
          return { ...event, ...data };
        }
        return event;
      }));
      
      toast({
        title: "Event updated",
        description: "Your event has been updated successfully",
      });
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        ...data as Omit<CalendarEvent, 'id'>,
        id: uuidv4(),
      };
      
      setEvents(prev => [...prev, newEvent]);
      
      toast({
        title: "Event created",
        description: "Your new event has been created successfully",
      });
    }
    
    setDialogType(null);
  };
  
  return (
    <div className="h-full">
      <CalendarView
        tasks={tasks}
        events={events}
        currentDate={currentDate}
        onPrevious={handlePreviousMonth}
        onNext={handleNextMonth}
        onAddTask={handleAddTask}
        onAddEvent={handleAddEvent}
        onEditTask={handleEditTask}
        onEditEvent={handleEditEvent}
      />
      
      <Dialog open={dialogType === 'task'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={currentTask}
            onSubmit={handleSubmitTask}
            onCancel={() => setDialogType(null)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={dialogType === 'event'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <EventForm
            event={currentEvent}
            onSubmit={handleSubmitEvent}
            onCancel={() => setDialogType(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
