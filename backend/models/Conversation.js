import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: null },
}, { timestamps: true });

// Ensure unique conversations between any 2 users
conversationSchema.index({ participants: 1 });

export default mongoose.model('Conversation', conversationSchema);
