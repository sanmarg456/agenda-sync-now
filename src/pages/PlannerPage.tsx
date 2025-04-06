import React, { useState, useEffect } from 'react';
import { DailyPlanner } from '@/components/planner/DailyPlanner';
import { useToast } from '@/hooks/use-toast';
import { Task, CalendarEvent, TimeBlock } from '@/types';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { taskService } from '@/services/taskService';
import { calendarService } from '@/services/calendarService';
import { plannerService } from '@/services/plannerService';

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      const [tasksData, eventsData] = await Promise.all([
        taskService.getTasks(),
        calendarService.getEvents(startOfDay(today), endOfDay(today))
      ]);
      setTasks(tasksData);
      setEvents(eventsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load planner data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAcceptTask = async (taskId: string, start: Date, end: Date) => {
    try {
      // Create a time block for the task
      const timeBlock: Omit<TimeBlock, 'id'> = {
        start,
        end,
        taskId
      };

      // Get or create daily plan
      const today = new Date();
      let dailyPlan = await plannerService.getDailyPlan(today);
      if (!dailyPlan) {
        dailyPlan = await plannerService.createDailyPlan(today);
      }

      // Create time block
      await plannerService.createTimeBlock(dailyPlan.id, timeBlock);

      // Update task with time block
      const updatedTask = await taskService.updateTask(taskId, {
        timeBlock: { start, end }
      });

      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return updatedTask;
        }
        return task;
      }));
      
      toast({
        title: "Task scheduled",
        description: "The task has been added to your calendar",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSnoozeTask = async (taskId: string) => {
    try {
      const newDueDate = addDays(new Date(), 1);
      const updatedTask = await taskService.updateTask(taskId, {
        dueDate: newDueDate
      });

      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return updatedTask;
        }
        return task;
      }));
      
      toast({
        title: "Task snoozed",
        description: "The task has been snoozed until tomorrow",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to snooze task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleGeneratePlan = async () => {
    try {
      const today = new Date();
      let dailyPlan = await plannerService.getDailyPlan(today);
      if (!dailyPlan) {
        dailyPlan = await plannerService.createDailyPlan(today);
      }

      // Get unscheduled tasks
      const unscheduledTasks = tasks.filter(task => !task.completed && !task.timeBlock);
      
      // Generate time blocks
      let currentStartTime = new Date();
      currentStartTime.setHours(9, 0, 0, 0); // Start at 9 AM
      
      for (const task of unscheduledTasks) {
        const newStartTime = new Date(currentStartTime);
        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newStartTime.getMinutes() + (task.duration || 30));
        
        // Create time block
        await plannerService.createTimeBlock(dailyPlan.id, {
          start: newStartTime,
          end: newEndTime,
          taskId: task.id
        });

        // Update task
        await taskService.updateTask(task.id, {
          timeBlock: {
            start: newStartTime,
            end: newEndTime
          }
        });

        // Update start time for next task
        currentStartTime = new Date(newEndTime);
        currentStartTime.setMinutes(currentStartTime.getMinutes() + 15); // 15 min break
      }

      // Reload data to get updated tasks
      await loadData();
      
      toast({
        title: "Daily plan generated",
        description: "Your tasks have been scheduled for today",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="text-center">Loading planner data...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Planner</h1>
      <p>Planner view coming soon...</p>
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
