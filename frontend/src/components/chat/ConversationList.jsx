import { useEffect, useState } from 'react';
import { getConversations } from '../../api/chatApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { MessageCircle } from 'lucide-react';

const ConversationList = ({ activeConvId, onSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getConversations()
      .then(({ data }) => setConversations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getOtherParticipant = (conv) =>
    conv.participants?.find(p => p._id !== user?._id) || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
        <MessageCircle className="h-10 w-10 mb-2 opacity-30" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map(conv => {
        const other = getOtherParticipant(conv);
        const isActive = conv._id === activeConvId;
        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
              isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
              {(other.name || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-slate-800 truncate">{other.name}</span>
                <span className="text-xs text-slate-400 capitalize ml-1">{other.role}</span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {conv.lastMessage || 'No messages yet'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
