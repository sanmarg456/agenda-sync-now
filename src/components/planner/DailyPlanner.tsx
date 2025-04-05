
import React, { useState } from 'react';
import { Task, CalendarEvent } from '@/types';
import { format, addMinutes } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CalendarClock, CheckCircle, XCircle, AlarmClock } from 'lucide-react';

interface DailyPlannerProps {
  tasks: Task[];
  events: CalendarEvent[];
  onAcceptTask: (taskId: string, start: Date, end: Date) => void;
  onSnoozeTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onGeneratePlan: () => void;
}

export function DailyPlanner({
  tasks,
  events,
  onAcceptTask,
  onSnoozeTask,
  onDeleteTask,
  onGeneratePlan,
}: DailyPlannerProps) {
  const [activeTab, setActiveTab] = useState('tasks');
  
  // Filter tasks for today and not completed
  const todayTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Filter events for today
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Generate time suggestions for tasks
  const generateSuggestion = (task: Task, index: number) => {
    const now = new Date();
    // Start at 9 AM or current time if later
    let startTime = new Date();
    startTime.setHours(9, 0, 0, 0);
    
    if (now > startTime) {
      // Round current time to nearest 15 minutes
      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      startTime = new Date(now);
      startTime.setMinutes(roundedMinutes, 0, 0);
    }
    
    // Add 30 minutes for each previous task
    startTime.setMinutes(startTime.getMinutes() + (index * 30));
    
    // Calculate end time based on task duration
    const endTime = addMinutes(startTime, task.duration || 30);
    
    return { start: startTime, end: endTime };
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Daily Planner</CardTitle>
          <Button onClick={onGeneratePlan}>
            Generate Plan
          </Button>
        </div>
        <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Tasks ({todayTasks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Events ({todayEvents.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-4 space-y-4">
            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No tasks for today</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enjoy your free time or add a new task for today.
                </p>
              </div>
            ) : (
              todayTasks.map((task, index) => {
                const suggestion = generateSuggestion(task, index);
                
                return (
                  <Card key={task.id} className={`task-card priority-${task.priority}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{task.title}</h3>
                          <span className="rounded-full bg-muted px-2 py-1 text-xs">
                            {task.duration} min
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Suggested time block:</span>
                          <span className="font-medium">
                            {format(suggestion.start, 'h:mm a')} - {format(suggestion.end, 'h:mm a')}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => onDeleteTask(task.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => onSnoozeTask(task.id)}
                          >
                            <AlarmClock className="h-4 w-4 mr-1" />
                            Snooze
                          </Button>
                          
                          <Button 
                            size="sm"
                            className="h-8"
                            onClick={() => onAcceptTask(task.id, suggestion.start, suggestion.end)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
          
          <TabsContent value="events" className="mt-4 space-y-4">
            {todayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarClock className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No events scheduled</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your calendar is clear for today.
                </p>
              </div>
            ) : (
              todayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="bg-app-orange h-2"></div>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          Event
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                        </span>
                      </div>
                      
                      {event.notes && (
                        <p className="text-sm text-muted-foreground">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
