
import React from 'react';
import { CalendarEvent } from '@/types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EventFormProps {
  event?: Partial<CalendarEvent>;
  onSubmit: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}

type FormValues = Omit<CalendarEvent, 'id'>;

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: event?.title || '',
      start: event?.start || new Date(),
      end: event?.end || new Date(new Date().setHours(new Date().getHours() + 1)),
      notes: event?.notes || '',
      taskId: event?.taskId,
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      id: event?.id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date & Time</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setHours(field.value.getHours());
                            newDate.setMinutes(field.value.getMinutes());
                            field.onChange(newDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select 
                    value={field.value.getHours().toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(field.value);
                      newDate.setHours(parseInt(value));
                      field.onChange(newDate);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={field.value.getMinutes().toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(field.value);
                      newDate.setMinutes(parseInt(value));
                      field.onChange(newDate);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 15, 30, 45].map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date & Time</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setHours(field.value.getHours());
                            newDate.setMinutes(field.value.getMinutes());
                            field.onChange(newDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select 
                    value={field.value.getHours().toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(field.value);
                      newDate.setHours(parseInt(value));
                      field.onChange(newDate);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={field.value.getMinutes().toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(field.value);
                      newDate.setMinutes(parseInt(value));
                      field.onChange(newDate);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 15, 30, 45].map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add event details..." 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {event?.id ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
