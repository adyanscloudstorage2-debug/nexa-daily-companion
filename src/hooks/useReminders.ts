import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  scheduled_for: string;
  completed: boolean;
  created_at: string;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createReminder = useCallback(async (
    title: string,
    description: string | undefined,
    scheduledFor: Date
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create reminders.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          title,
          description,
          scheduled_for: scheduledFor.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newReminder: Reminder = {
        id: data.id,
        title: data.title,
        description: data.description,
        scheduled_for: data.scheduled_for,
        completed: data.completed,
        created_at: data.created_at,
      };

      setReminders(prev => [...prev, newReminder]);

      toast({
        title: "Reminder created!",
        description: `You'll be reminded about "${title}"`,
      });
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to create reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const toggleReminder = useCallback(async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;

      setReminders(prev =>
        prev.map(reminder =>
          reminder.id === id ? { ...reminder, completed } : reminder
        )
      );
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder.",
        variant: "destructive",
      });
    }
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(reminder => reminder.id !== id));

      toast({
        title: "Reminder deleted",
        description: "The reminder has been removed.",
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to delete reminder.",
        variant: "destructive",
      });
    }
  }, []);

  const loadReminders = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;

      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }, [user]);

  const getUpcomingReminders = useCallback(() => {
    const now = new Date();
    const upcoming = reminders.filter(reminder => 
      !reminder.completed && new Date(reminder.scheduled_for) > now
    );
    return upcoming.slice(0, 5);
  }, [reminders]);

  const getOverdueReminders = useCallback(() => {
    const now = new Date();
    return reminders.filter(reminder => 
      !reminder.completed && new Date(reminder.scheduled_for) <= now
    );
  }, [reminders]);

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user, loadReminders]);

  return {
    reminders,
    isLoading,
    createReminder,
    toggleReminder,
    deleteReminder,
    loadReminders,
    getUpcomingReminders,
    getOverdueReminders,
  };
};