import { useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '../store/auth';
import { api } from '../utils/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: ProductCard[];
}

export interface ProductCard {
  _id: string;
  name: string;
  price: number;
  comparePrice?: number;
  slug: string;
  images?: { url: string; alt: string }[];
  ratings?: { average: number; count: number };
  stock: number;
  category?: { name: string };
  isFeatured?: boolean;
}

interface ChatContext {
  products: ProductCard[];
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

  const loadContext = async () => {
    if (contextRef.current) return;
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
        // Only send role+content to AI, not products
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        context: contextRef.current,
      };

      if (isAuthenticated && user?.id) {
        payload.userId = user.id;
      }

      const { data } = await api.post('/chat', payload);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        products: data.products || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Sorry, I ran into an issue. Please try again!';
      setMessages(prev => [...prev, { role: 'assistant', content: msg, products: [] }]);
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