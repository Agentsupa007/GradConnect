import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessages } from '../../api/chatApi.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import { Send } from 'lucide-react';

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const other = conversation?.participants?.find(p => p._id !== user?._id) || {};

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!conversation?._id) return;
    setLoading(true);
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
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
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

  useEffect(() => { scrollToBottom(); }, [messages]);

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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
          {(other.name || '?')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{other.name}</p>
          <p className="text-xs text-slate-500 capitalize">{other.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map(msg => <MessageBubble key={msg._id} message={msg} />)}
            {typingUser && (
              <div className="text-xs text-slate-500 italic px-2 mb-2">{typingUser} is typing...</div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
