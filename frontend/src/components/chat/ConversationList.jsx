import { useEffect, useState } from 'react';
import { getConversations } from '../../api/chatApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const avatarBgs = [
  'bg-indigo-500', 'bg-sky-500', 'bg-violet-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const roleLabel = { student: 'Student', recruiter: 'Recruiter', alumni: 'Alumni' };

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

  const getOther = (conv) => conv.participants?.find(p => p._id !== user?._id) || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-3xl mb-3">💬</div>
        <p className="text-sm font-medium text-zinc-700">No conversations yet</p>
        <p className="text-xs text-zinc-400 mt-1">Start one from the search page</p>
      </div>
    );
  }

  return (
    <div>
      {conversations.map(conv => {
        const other = getOther(conv);
        const isActive = conv._id === activeConvId;
        const bg = avatarBgs[(other.name || 'U').charCodeAt(0) % avatarBgs.length];

        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
              isActive ? 'bg-indigo-50 border-r-2 border-indigo-500' : 'hover:bg-zinc-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {(other.name || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-zinc-800'}`}>
                  {other.name}
                </span>
                <span className="text-[10px] text-zinc-400 capitalize ml-1 flex-shrink-0">{roleLabel[other.role]}</span>
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {conv.lastMessage || 'Say hello 👋'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
