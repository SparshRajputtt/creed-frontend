import { userAtom, isAuthenticatedAtom } from '../store/auth';
import { api } from '../utils/api';
import { useState, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';


export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContext {
  products: unknown[];
  categories: unknown[];
  coupons: unknown[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContextLoading, setIsContextLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contextRef = useRef<ChatContext | null>(null);

  const user = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  // Fetch context once when hook mounts (or when chat opens)
  const loadContext = async () => {
    if (contextRef.current) return; // already loaded
    setIsContextLoading(true);
    try {
      const { data } = await api.get('/chat/context');
      contextRef.current = data;
    } catch (err) {
      console.error('Failed to load chat context:', err);
      setError('Failed to load store data. Please try again.');
    } finally {
      setIsContextLoading(false);
    }
  };

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        messages: updatedMessages,
        context: contextRef.current,
      };

      // Send userId if logged in so chatbot can fetch their orders
      if (isAuthenticated && user?.id) {
        payload.userId = user.id;
      }

      const { data } = await api.post('/chat', payload);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg = err?.response?.data?.error || 'Sorry, I ran into an issue. Please try again!';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    isContextLoading,
    error,
    sendMessage,
    clearChat,
    loadContext,
    isAuthenticated,
    userName: user?.firstName || null,
  };
};