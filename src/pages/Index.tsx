import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { Navigation } from '@/components/Navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { QuickActions } from '@/components/QuickActions';
import { MoodTracker } from '@/components/MoodTracker';
import { RemindersList } from '@/components/RemindersList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const { sendMessage } = useChat();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleQuickAction = async (prompt: string) => {
    setActiveTab('chat');
    await sendMessage(prompt);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <div className="container mx-auto flex flex-1 flex-col p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="reminders">Tasks</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1">
            <div className="h-[calc(100vh-12rem)] overflow-hidden rounded-lg border bg-card">
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="mood" className="flex-1">
            <div className="mx-auto max-w-2xl">
              <MoodTracker />
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="flex-1">
            <div className="mx-auto max-w-2xl">
              <RemindersList />
            </div>
          </TabsContent>

          <TabsContent value="actions" className="flex-1">
            <div className="mx-auto max-w-2xl">
              <QuickActions onAction={handleQuickAction} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
