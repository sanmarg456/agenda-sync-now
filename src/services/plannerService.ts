import { supabase } from '@/lib/supabase';
import { DailyPlan, TimeBlock } from '@/types';

export const plannerService = {
  async getDailyPlan(date: Date) {
    const { data, error } = await supabase
      .from('daily_plans')
      .select(`
        *,
        time_blocks (
          *,
          task:task_id (*)
        )
      `)
      .eq('date', date.toISOString().split('T')[0])
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createDailyPlan(date: Date) {
    const { data, error } = await supabase
      .from('daily_plans')
      .insert([{ date }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createTimeBlock(dailyPlanId: string, timeBlock: Omit<TimeBlock, 'id'>) {
    const { data, error } = await supabase
      .from('time_blocks')
      .insert([{
        daily_plan_id: dailyPlanId,
        task_id: timeBlock.taskId,
        start_time: timeBlock.start,
        end_time: timeBlock.end
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTimeBlock(id: string, timeBlock: Partial<TimeBlock>) {
    const { data, error } = await supabase
      .from('time_blocks')
      .update({
        start_time: timeBlock.start,
        end_time: timeBlock.end,
        task_id: timeBlock.taskId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTimeBlock(id: string) {
    const { error } = await supabase
      .from('time_blocks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 