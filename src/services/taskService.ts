import { Task, Subtask, Category, Priority, TimeBlock } from '@/types';
import { supabase } from '@/lib/supabase';

export const taskService = {
  async getTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return tasks.map(task => ({
      ...task,
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category as Category,
      priority: task.priority as Priority,
      dueDate: task.due_date,
      completed: task.completed,
      duration: task.duration,
      timeBlock: task.time_block ? JSON.parse(task.time_block) as TimeBlock : null,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      userId: task.user_id,
      subtasks: task.subtasks?.map(subtask => ({
        id: subtask.id,
        title: subtask.title,
        completed: subtask.completed,
        taskId: subtask.task_id,
        createdAt: subtask.created_at,
        updatedAt: subtask.updated_at,
      })) || [],
    }));
  },

  async createTask(task: Omit<Task, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed,
        duration: task.duration,
        time_block: task.timeBlock ? JSON.stringify(task.timeBlock) : null,
        user_id: user.id,
      })
      .select(`
        *,
        subtasks (*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category as Category,
      priority: data.priority as Priority,
      dueDate: data.due_date,
      completed: data.completed,
      duration: data.duration,
      timeBlock: data.time_block ? JSON.parse(data.time_block) as TimeBlock : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      subtasks: data.subtasks?.map(subtask => ({
        id: subtask.id,
        title: subtask.title,
        completed: subtask.completed,
        taskId: subtask.task_id,
        createdAt: subtask.created_at,
        updatedAt: subtask.updated_at,
      })) || [],
    };
  },

  async updateTask(id: string, task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed,
        duration: task.duration,
        time_block: task.timeBlock ? JSON.stringify(task.timeBlock) : undefined,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        subtasks (*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category as Category,
      priority: data.priority as Priority,
      dueDate: data.due_date,
      completed: data.completed,
      duration: data.duration,
      timeBlock: data.time_block ? JSON.parse(data.time_block) as TimeBlock : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      subtasks: data.subtasks?.map(subtask => ({
        id: subtask.id,
        title: subtask.title,
        completed: subtask.completed,
        taskId: subtask.task_id,
        createdAt: subtask.created_at,
        updatedAt: subtask.updated_at,
      })) || [],
    };
  },

  async deleteTask(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async createSubtask(taskId: string, subtask: Omit<Subtask, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        title: subtask.title,
        completed: subtask.completed,
        task_id: taskId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      taskId: data.task_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateSubtask(id: string, subtask: Partial<Subtask>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subtasks')
      .update({
        title: subtask.title,
        completed: subtask.completed,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      taskId: data.task_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteSubtask(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
}; 