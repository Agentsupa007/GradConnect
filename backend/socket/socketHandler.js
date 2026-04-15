import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Map userId -> Set of socketIds (user can have multiple tabs)
const onlineUsers = new Map();

const socketHandler = (io) => {
  // Authenticate every socket on connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token?.replace('Bearer ', '');
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) return next(new Error('User not found'));

      socket.data.userId = user._id.toString();
      socket.data.user = { _id: user._id, name: user.name, role: user.role };
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log(`Socket connected: ${socket.id} (user: ${userId})`);

    // Track online users
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // Notify contacts that user is online
    socket.broadcast.emit('userOnline', { userId });

    // Join a conversation room
    socket.on('joinRoom', ({ conversationId }) => {
      socket.join(conversationId);
      socket.emit('roomJoined', { conversationId });
    });

    // Leave a conversation room
    socket.on('leaveRoom', ({ conversationId }) => {
      socket.leave(conversationId);
    });

    // Send message
    socket.on('sendMessage', async ({ conversationId, content }) => {
      try {
        if (!conversationId || !content?.trim()) return;

        // Verify sender is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        const isParticipant = conversation.participants.some(
          p => p.toString() === userId
        );
        if (!isParticipant) return;

        // Persist message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content.trim(),
        });

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content.trim().substring(0, 100),
          lastMessageAt: new Date(),
        });

        const populated = await message.populate('sender', 'name email role');

        // Emit to all in the room
        io.to(conversationId).emit('receiveMessage', populated);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ conversationId }) => {
      socket.to(conversationId).emit('userTyping', {
        userId,
        name: socket.data.user.name,
        conversationId,
      });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(conversationId).emit('userStoppedTyping', { userId, conversationId });
    });

    // Mark messages as read
    socket.on('markRead', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: userId }, isRead: false },
          { $set: { isRead: true, readAt: new Date() } }
        );
        socket.to(conversationId).emit('messagesRead', { conversationId, userId });
      } catch (err) {
        // Silently ignore
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('userOffline', { userId });
        }
      }
    });
  });
};

export default socketHandler;
