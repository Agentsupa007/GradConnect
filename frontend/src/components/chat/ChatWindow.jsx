import { useState, useEffect, useRef } from 'react';
import { getMessages } from '../../api/chatApi.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import { Send } from 'lucide-react';

const avatarBgs = [
  'bg-indigo-500', 'bg-sky-500', 'bg-violet-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const inputRef = useRef(null);

  const other = conversation?.participants?.find(p => p._id !== user?._id) || {};
  const avatarColor = avatarBgs[(other.name || 'U').charCodeAt(0) % avatarBgs.length];

  useEffect(() => {
    if (!conversation?._id) return;
    setLoading(true);
    setMessages([]);
    getMessages(conversation._id)
      .then(({ data }) => setMessages(data.messages))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversation?._id]);

  useEffect(() => {
    if (!socket || !conversation?._id) return;
    socket.emit('joinRoom', { conversationId: conversation._id });
    socket.emit('markRead', { conversationId: conversation._id });

    const handleReceive = (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
    };
    const handleTyping = ({ userId: uid }) => {
      if (uid !== user?._id) setTypingUser(other.name);
    };
    const handleStopTyping = () => setTypingUser(null);

    socket.on('receiveMessage', handleReceive);
    socket.on('userTyping', handleTyping);
    socket.on('userStoppedTyping', handleStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.off('userTyping', handleTyping);
      socket.off('userStoppedTyping', handleStopTyping);
    };
  }, [socket, conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket && conversation?._id) {
      socket.emit('typing', { conversationId: conversation._id });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('stopTyping', { conversationId: conversation._id });
      }, 1500);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !conversation?._id) return;
    socket.emit('sendMessage', { conversationId: conversation._id, content: input.trim() });
    setInput('');
    socket.emit('stopTyping', { conversationId: conversation._id });
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-zinc-100 bg-white flex items-center gap-3 flex-shrink-0">
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
          {(other.name || '?')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 text-sm leading-tight">{other.name}</p>
          <p className="text-xs text-zinc-400 capitalize">{other.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#f5f4f0]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-sm font-medium text-zinc-600">Say hello to {other.name?.split(' ')[0]}</p>
            <p className="text-xs text-zinc-400 mt-1">Your conversation starts here</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map(msg => <MessageBubble key={msg._id} message={msg} />)}
            {typingUser && (
              <div className="flex items-center gap-2 px-1 pt-1">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-zinc-400">{typingUser} is typing</span>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-zinc-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${other.name?.split(' ')[0] || ''}...`}
            className="flex-1 bg-zinc-100 border-0 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-800 placeholder-zinc-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
