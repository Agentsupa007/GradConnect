import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getConversations } from '../../api/chatApi.js';
import { MessageCircle } from 'lucide-react';
import ConversationList from '../../components/chat/ConversationList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';

const RecruiterChatPage = () => {
  const [searchParams] = useSearchParams();
  const [activeConv, setActiveConv] = useState(null);

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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Your conversations with candidates</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden" style={{ height: '72vh' }}>
        <div className="flex h-full">
          <div className="w-64 border-r border-zinc-100 flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList activeConvId={activeConv?._id} onSelect={setActiveConv} />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            {activeConv ? (
              <ChatWindow conversation={activeConv} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="font-semibold text-zinc-700">No conversation selected</p>
                <p className="text-sm text-zinc-400 mt-1 max-w-xs">Start by chatting with a student from the search or shortlist page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterChatPage;
