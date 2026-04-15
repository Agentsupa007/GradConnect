import { useAuth } from '../../context/AuthContext.jsx';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isMine = message.sender?._id === user?._id || message.sender === user?._id;
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-[72%]`}>
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-[11px] text-zinc-400 mt-0.5 ${isMine ? 'text-right pr-1' : 'pl-1'}`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
