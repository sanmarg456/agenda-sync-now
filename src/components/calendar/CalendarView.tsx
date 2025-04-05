
import React, { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Task, CalendarEvent } from '@/types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeBlockItem } from './TimeBlockItem';

interface CalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onAddTask: () => void;
  onAddEvent: () => void;
  onEditTask: (task: Task) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

export function CalendarView({
  tasks,
  events,
  currentDate,
  onPrevious,
  onNext,
  onAddTask,
  onAddEvent,
  onEditTask,
  onEditEvent,
}: CalendarViewProps) {
  // Generate week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  // Hour labels (8 AM to 9 PM)
  const hours = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => i + 8);
  }, []);

  // Filter tasks with time blocks
  const tasksWithTimeBlocks = useMemo(() => {
    return tasks.filter(task => task.timeBlock);
  }, [tasks]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onAddEvent} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Event
          </Button>
          <Button onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Task
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border shadow-sm flex-1 overflow-hidden">
        {/* Calendar header with weekdays */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div> {/* Empty corner cell */}
          {weekDays.map((day) => (
            <div 
              key={day.toString()} 
              className={`p-2 text-center font-medium ${
                isSameDay(day, new Date()) ? 'bg-primary/10' : ''
              }`}
            >
              <div>{format(day, 'EEE')}</div>
              <div className={`text-lg ${
                isSameDay(day, new Date()) ? 'text-primary font-bold' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Calendar body with time slots */}
        <div className="grid grid-cols-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {/* Time labels */}
          <div className="col-span-1 border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b p-1 text-xs text-right pr-2">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
          
          {/* Time slots for each day */}
          {weekDays.map((day) => (
            <div key={day.toString()} className="col-span-1 relative">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="h-20 border-b border-r p-1 text-xs hover:bg-muted/40"
                >
                  {/* Render events and tasks here */}
                </div>
              ))}
              
              {/* Overlay events */}
              <div className="absolute inset-0 pointer-events-none">
                {events
                  .filter(event => {
                    const eventDate = new Date(event.start);
                    return isSameDay(eventDate, day);
                  })
                  .map(event => {
                    const startHour = new Date(event.start).getHours();
                    const endHour = new Date(event.end).getHours();
                    const startMinutes = new Date(event.start).getMinutes();
                    const endMinutes = new Date(event.end).getMinutes();
                    
                    const top = ((startHour - 8) * 80) + (startMinutes / 60 * 80);
                    const height = ((endHour - startHour) * 80) + ((endMinutes - startMinutes) / 60 * 80);
                    
                    return (
                      <TimeBlockItem 
                        key={event.id}
                        title={event.title}
                        start={format(new Date(event.start), 'h:mm a')}
                        end={format(new Date(event.end), 'h:mm a')}
                        type="event"
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => onEditEvent(event)}
                      />
                    );
                  })}
                
                {tasksWithTimeBlocks
                  .filter(task => {
                    if (!task.timeBlock) return false;
                    const taskDate = new Date(task.timeBlock.start);
                    return isSameDay(taskDate, day);
                  })
                  .map(task => {
                    if (!task.timeBlock) return null;
                    
                    const startHour = new Date(task.timeBlock.start).getHours();
                    const endHour = new Date(task.timeBlock.end).getHours();
                    const startMinutes = new Date(task.timeBlock.start).getMinutes();
                    const endMinutes = new Date(task.timeBlock.end).getMinutes();
                    
                    const top = ((startHour - 8) * 80) + (startMinutes / 60 * 80);
                    const height = ((endHour - startHour) * 80) + ((endMinutes - startMinutes) / 60 * 80);
                    
                    return (
                      <TimeBlockItem 
                        key={task.id}
                        title={task.title}
                        start={format(new Date(task.timeBlock.start), 'h:mm a')}
                        end={format(new Date(task.timeBlock.end), 'h:mm a')}
                        type="task"
                        completed={task.completed}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => onEditTask(task)}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
