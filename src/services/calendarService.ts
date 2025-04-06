import { supabase } from '@/lib/supabase';
import { CalendarEvent } from '@/types';

export const calendarService = {
  async getEvents(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        task:task_id (*)
      `)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{
        title: event.title,
        start_time: event.start,
        end_time: event.end,
        notes: event.notes,
        task_id: event.taskId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, event: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({
        title: event.title,
        start_time: event.start,
        end_time: event.end,
        notes: event.notes,
        task_id: event.taskId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 