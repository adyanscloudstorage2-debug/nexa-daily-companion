import { useState, useCallback } from 'react';
import { ChatMessage, aiService } from '@/services/ai';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (content: string, mode: 'general' | 'study' | 'language' = 'general') => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response: string;

      switch (mode) {
        case 'study':
          response = await aiService.studyAssistant(content);
          break;
        case 'language':
          response = await aiService.languagePractice(content, 'grammar');
          break;
        default:
          response = await aiService.generateResponse(content, messages);
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to database if user is authenticated
      if (user) {
        await saveChatHistory([userMessage, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, user]);

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    if (!user) return;

    try {
      const chatData = newMessages.map(msg => ({
        user_id: user.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      await supabase.from('chat_history').insert(chatData);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadChatHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) throw error;

      const chatMessages: ChatMessage[] = data.map(item => ({
        role: item.role as 'user' | 'assistant',
        content: item.content,
        timestamp: new Date(item.timestamp),
      }));

      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [user]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    loadChatHistory,
    clearChat,
  };
};