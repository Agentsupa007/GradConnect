import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getConversations } from '../../api/chatApi.js';
import { MessageCircle } from 'lucide-react';
import ConversationList from '../../components/chat/ConversationList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';

const RecruiterChatPage = () => {
  const [searchParams] = useSearchParams();
  const [activeConv, setActiveConv] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Auto-select conversation from query param
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId) {
      getConversations().then(({ data }) => {
        const found = data.find(c => c._id === convId);
        if (found) setActiveConv(found);
      }).catch(() => {});
    }
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex h-full">
          <div className="w-72 border-r border-slate-200 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList activeConvId={activeConv?._id} onSelect={setActiveConv} />
            </div>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            {activeConv ? (
              <ChatWindow conversation={activeConv} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Start by chatting with a student from the search page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterChatPage;
