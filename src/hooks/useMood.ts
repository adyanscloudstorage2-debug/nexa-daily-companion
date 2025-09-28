import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { aiService, MoodEntry } from '@/services/ai';
import { toast } from '@/hooks/use-toast';

export interface MoodLog {
  id: string;
  mood: string;
  emoji: string;
  description?: string;
  ai_response?: string;
  created_at: string;
}

export const useMood = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const logMood = useCallback(async (moodEntry: MoodEntry) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to track your mood.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get AI response for mood
      const aiResponse = await aiService.moodSupport(moodEntry);

      // Save to database
      const { data, error } = await supabase
        .from('mood_logs')
        .insert({
          user_id: user.id,
          mood: moodEntry.mood,
          emoji: moodEntry.emoji,
          description: moodEntry.description,
          ai_response: aiResponse,
        })
        .select()
        .single();

      if (error) throw error;

      const newMoodLog: MoodLog = {
        id: data.id,
        mood: data.mood,
        emoji: data.emoji,
        description: data.description,
        ai_response: data.ai_response,
        created_at: data.created_at,
      };

      setMoodLogs(prev => [newMoodLog, ...prev]);

      toast({
        title: "Mood logged!",
        description: "Thanks for sharing how you're feeling.",
      });

      return aiResponse;
    } catch (error) {
      console.error('Error logging mood:', error);
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadMoodHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      setMoodLogs(data || []);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  }, [user]);

  const getMoodStats = useCallback(() => {
    if (moodLogs.length === 0) return null;

    const moodCounts = moodLogs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const recentMoods = moodLogs.slice(0, 7);
    const weeklyAverage = recentMoods.length > 0 ? recentMoods.length / 7 : 0;

    return {
      totalEntries: moodLogs.length,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      moodCounts,
    };
  }, [moodLogs]);

  useEffect(() => {
    if (user) {
      loadMoodHistory();
    }
  }, [user, loadMoodHistory]);

  return {
    moodLogs,
    isLoading,
    logMood,
    loadMoodHistory,
    getMoodStats,
  };
};