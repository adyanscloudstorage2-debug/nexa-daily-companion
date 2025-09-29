import { useState } from 'react';
import { useMood } from '@/hooks/useMood';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const moods = [
  { mood: 'happy', emoji: '😊', label: 'Happy' },
  { mood: 'sad', emoji: '😢', label: 'Sad' },
  { mood: 'excited', emoji: '🤩', label: 'Excited' },
  { mood: 'calm', emoji: '😌', label: 'Calm' },
  { mood: 'anxious', emoji: '😰', label: 'Anxious' },
];

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [description, setDescription] = useState('');
  const { logMood, isLoading } = useMood();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: 'Select a mood',
        description: 'Please select how you\'re feeling.',
        variant: 'destructive',
      });
      return;
    }

    const moodData = moods.find((m) => m.mood === selectedMood);
    if (!moodData) return;

    const response = await logMood({
      mood: moodData.label,
      emoji: moodData.emoji,
      description: description.trim() || undefined,
    });

    if (response) {
      toast({
        title: 'Mood logged',
        description: response,
      });
      setSelectedMood('');
      setDescription('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling?</CardTitle>
        <CardDescription>Track your mood and get supportive feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {moods.map(({ mood, emoji, label }) => (
            <Button
              key={mood}
              variant={selectedMood === mood ? 'default' : 'outline'}
              className="flex h-20 flex-col gap-1"
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
        <Textarea
          placeholder="Tell me more about how you're feeling... (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px]"
        />
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log Mood
        </Button>
      </CardContent>
    </Card>
  );
};
