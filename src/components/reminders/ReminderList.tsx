
import React from 'react';
import { Task, CalendarEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bell, CalendarClock, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReminderListProps {
  tasks: Task[];
  events: CalendarEvent[];
  onAddReminder: () => void;
  onSnoozeReminder: (type: 'task' | 'event', id: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export function ReminderList({
  tasks,
  events,
  onAddReminder,
  onSnoozeReminder,
  onCompleteTask,
}: ReminderListProps) {
  // Filter upcoming tasks
  const upcomingTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    
    return new Date(task.dueDate) > new Date();
  }).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Filter upcoming events
  const upcomingEvents = events.filter(event => {
    return new Date(event.start) > new Date();
  }).sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Reminders
        </h1>
        <Button onClick={onAddReminder}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckSquare className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No upcoming task reminders</h3>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingTasks.slice(0, 5).map(task => (
                  <li key={task.id} className={`flex gap-3 p-3 rounded-lg border priority-${task.priority}`}>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due {task.dueDate ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true }) : 'anytime'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSnoozeReminder('task', task.id)}
                      >
                        Snooze
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onCompleteTask(task.id)}
                      >
                        Done
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Event Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarClock className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No upcoming event reminders</h3>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingEvents.slice(0, 5).map(event => (
                  <li key={event.id} className="flex gap-3 p-3 rounded-lg border border-l-4 border-l-app-orange">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Starts {formatDistanceToNow(new Date(event.start), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSnoozeReminder('event', event.id)}
                      >
                        Snooze
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
