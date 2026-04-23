import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageCircle, X, Send, Trash2, Bot,
  Loader2, ChevronDown, Sparkles, Star,
  ShoppingBag, ExternalLink,
} from 'lucide-react';
import { useChat, type ProductCard } from '../queries/hooks/useChat';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:4000';

// ─── Markdown renderer (bold + bullets, no library needed) ───────────────────
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const boldified = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return (
        <li key={i} className="ml-3 list-disc" dangerouslySetInnerHTML={{ __html: boldified.replace(/^[-•]\s/, '') }} />
      );
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: boldified }} />;
  });
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCardItem = ({ product }: { product: ProductCard }) => {
  const imageUrl = product.images?.[0]?.url
    ? product.images[0].url.startsWith('http')
      ? product.images[0].url
      : `${BACKEND_URL}${product.images[0].url}`
    : null;

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <motion.a
      href={`/products/${product.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex gap-3 bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={20} className="text-gray-300" />
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-tight truncate group-hover:text-black">
          {product.name}
        </p>
        {product.category?.name && (
          <p className="text-[10px] text-gray-400 mt-0.5">{product.category.name}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm font-bold text-black">₹{product.price}</span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">₹{product.comparePrice}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          {product.ratings?.average ? (
            <div className="flex items-center gap-0.5">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-gray-500">{product.ratings.average}</span>
            </div>
          ) : <span />}
          <span className={`text-[10px] font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center flex-shrink-0">
        <ExternalLink size={12} className="text-gray-300 group-hover:text-black transition-colors" />
      </div>
    </motion.a>
  );
};

// ─── Typing indicator ─────────────────────────────────────────────────────────
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

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({
  role,
  content,
  products,
}: {
  role: 'user' | 'assistant';
  content: string;
  products?: ProductCard[];
}) => {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2 mt-1 flex-shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className="max-w-[82%] flex flex-col gap-2">
        {/* Text bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed space-y-0.5 ${
            isUser
              ? 'bg-black text-white rounded-br-sm'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
          }`}
        >
          {isUser ? content : renderMarkdown(content)}
        </div>

        {/* Product cards */}
        {!isUser && products && products.length > 0 && (
          <div className="flex flex-col gap-2">
            {products.map((p) => (
              <ProductCardItem key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Suggestion chips ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  '🛍️ Show featured products',
  '🏷️ Any active coupons?',
  '📦 Track my order',
  '📂 What categories do you have?',
];

// ─── Main ChatBot component ───────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages, isLoading, isContextLoading, error,
    sendMessage, clearChat, loadContext, isAuthenticated, userName,
  } = useChat();

  useEffect(() => {
    if (isOpen) {
      loadContext();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading || isContextLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (text: string) => {
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
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center"
            aria-label="Open chat assistant"
          >
            <MessageCircle size={24} />
            <span className="absolute w-14 h-14 rounded-full bg-black opacity-20 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ width: 'min(390px, calc(100vw - 24px))', height: '580px' }}
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
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
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
                  <p className="font-semibold text-gray-800 text-sm">Hi{greetingName}! 👋</p>
                  <p className="text-gray-500 text-xs mt-1 max-w-[220px]">
                    I can help you find products, track orders, and apply coupons.
                  </p>
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

              {/* Context loading */}
              {isContextLoading && messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 pt-8">
                  <Loader2 size={22} className="animate-spin text-gray-400" />
                  <p className="text-xs text-gray-400">Loading store data…</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2 mb-3 text-center">
                  {error}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  products={msg.products}
                />
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

            {/* Scroll to bottom */}
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

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-black transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isContextLoading}
                  placeholder={isContextLoading ? 'Loading…' : 'Ask about products, orders…'}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || isContextLoading || !input.trim()}
                  className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-300 mt-1.5">Powered by Creed AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}