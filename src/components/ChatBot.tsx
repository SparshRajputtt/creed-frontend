import { useChat } from '../queries/hooks/useChat';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Bot,
  Loader2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

// ─── Typing indicator ────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </div>
);

// ─── Single message bubble ────────────────────────────────────────────────────
const MessageBubble = ({
  role,
  content,
}: {
  role: 'user' | 'assistant';
  content: string;
}) => {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2 mt-1 flex-shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-black text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
};

// ─── Quick suggestion chips ──────────────────────────────────────────────────
const SUGGESTIONS = [
  '🛍️ Show featured products',
  '🏷️ Any active coupons?',
  '📦 Track my order',
  '📂 What categories do you have?',
];

// ─── Main ChatBot component ──────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isContextLoading,
    error,
    sendMessage,
    clearChat,
    loadContext,
    isAuthenticated,
    userName,
  } = useChat();

  // Load store context when chat opens
  useEffect(() => {
    if (isOpen) {
      loadContext();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Show scroll-to-bottom button when scrolled up
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 80);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSend = () => {
    if (!input.trim() || isLoading || isContextLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (text: string) => {
    // Strip emoji prefix for cleaner message
    const clean = text.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(clean);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const greetingName = userName ? `, ${userName}` : '';

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center"
            aria-label="Open chat assistant"
          >
            <MessageCircle size={24} />
            {/* Pulse ring */}
            <span className="absolute w-14 h-14 rounded-full bg-black opacity-20 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ width: 'min(380px, calc(100vw - 24px))', height: '560px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-black text-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Creed Assistant</p>
                  <p className="text-[11px] text-white/60 leading-tight">
                    {isContextLoading ? 'Loading store data…' : 'Online · Ask me anything'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={handleClose}
                  title="Close"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 relative"
            >
              {/* Empty state */}
              {messages.length === 0 && !isContextLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center pt-4 pb-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-3 shadow-lg">
                    <Bot size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Hi{greetingName}! 👋
                  </p>
                  <p className="text-gray-500 text-xs mt-1 max-w-[220px]">
                    I can help you find products, track orders, and apply coupons.
                  </p>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        disabled={isContextLoading}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-black hover:text-black transition-colors disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {!isAuthenticated && (
                    <p className="text-[11px] text-gray-400 mt-4 max-w-[220px]">
                      💡 Log in to track your personal orders
                    </p>
                  )}
                </motion.div>
              )}

              {/* Context loading skeleton */}
              {isContextLoading && messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 pt-8">
                  <Loader2 size={22} className="animate-spin text-gray-400" />
                  <p className="text-xs text-gray-400">Loading store data…</p>
                </div>
              )}

              {/* Error banner */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2 mb-3 text-center">
                  {error}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-2"
                >
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-20 right-6 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center z-10"
                >
                  <ChevronDown size={16} className="text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div className="px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-black transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isContextLoading}
                  placeholder={
                    isContextLoading
                      ? 'Loading…'
                      : 'Ask about products, orders…'
                  }
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || isContextLoading || !input.trim()}
                  className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-300 mt-1.5">
                Powered by Creed AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}