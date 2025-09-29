import { useState } from 'react';
import { useReminders } from '@/hooks/useReminders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const RemindersList = () => {
  const { reminders, createReminder, toggleReminder, deleteReminder, isLoading } = useReminders();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!title.trim() || !scheduledFor) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and date.',
        variant: 'destructive',
      });
      return;
    }

    await createReminder(title, description || undefined, new Date(scheduledFor));
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setScheduledFor('');
    toast({
      title: 'Reminder created',
      description: 'Your reminder has been saved.',
    });
  };

  const upcomingReminders = reminders.filter((r) => !r.completed);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reminders</CardTitle>
            <CardDescription>Manage your tasks and reminders</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
                <Button onClick={handleCreate} className="w-full">
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : upcomingReminders.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No reminders yet</p>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    checked={reminder.completed}
                    onCheckedChange={(checked) =>
                      toggleReminder(reminder.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">{reminder.title}</p>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(reminder.scheduled_for), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
