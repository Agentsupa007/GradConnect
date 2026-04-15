import { useAuth } from '../../context/AuthContext.jsx';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isMine = message.sender?._id === user?._id || message.sender === user?._id;
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold mr-2 flex-shrink-0 self-end">
          {(message.sender?.name || '?')[0].toUpperCase()}
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
        {!isMine && (
          <p className="text-xs text-slate-500 mb-1 ml-1">{message.sender?.name}</p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-xs text-slate-400 mt-1 ${isMine ? 'text-right' : 'text-left'} ml-1`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
