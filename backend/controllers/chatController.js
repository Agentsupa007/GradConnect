import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// GET /api/chat/conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email role')
      .sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/conversations
export const createOrGetConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) return res.status(400).json({ message: 'recipientId is required' });
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId], $size: 2 },
    }).populate('participants', 'name email role');

    if (existing) return res.json(existing);

    const conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
    });
    const populated = await conversation.populate('participants', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/conversations/:convId/messages
export const getMessages = async (req, res) => {
  try {
    const { convId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify requester is a participant
    const conversation = await Conversation.findById(convId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    const messages = await Message.find({ conversation: convId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ conversation: convId });
    res.json({ messages, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
