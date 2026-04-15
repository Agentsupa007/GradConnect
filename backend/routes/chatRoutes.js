import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { getConversations, createOrGetConversation, getMessages } from '../controllers/chatController.js';

const router = express.Router();
router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createOrGetConversation);
router.get('/conversations/:convId/messages', getMessages);

export default router;
