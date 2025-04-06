import React, { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventForm } from '@/components/calendar/EventForm';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Task, CalendarEvent } from '@/types';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { taskService } from '@/services/taskService';
import { calendarService } from '@/services/calendarService';

type DialogType = 'task' | 'event' | null;

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, eventsData] = await Promise.all([
        taskService.getTasks(),
        calendarService.getEvents(
          startOfMonth(currentDate),
          endOfMonth(currentDate)
        )
      ]);
      setTasks(tasksData);
      setEvents(eventsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calendar data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
        
        setTasks(prev => [...prev, newTask]);
        
        toast({
          title: "Task created",
          description: "Your new task has been created successfully",
        });
      }
      
      setDialogType(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitEvent = async (data: Partial<CalendarEvent>) => {
    try {
      if (data.id) {
        // Update existing event
        const updatedEvent = await calendarService.updateEvent(data.id, data);
        setEvents(prev => prev.map(event => {
          if (event.id === data.id) {
            return updatedEvent;
          }
          return event;
        }));
        
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully",
        });
      } else {
        // Create new event
        const newEvent = await calendarService.createEvent(data as Omit<CalendarEvent, 'id'>);
        
        setEvents(prev => [...prev, newEvent]);
        
        toast({
          title: "Event created",
          description: "Your new event has been created successfully",
        });
      }
      
      setDialogType(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">Loading calendar data...</div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p>Calendar view coming soon...</p>
      
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
