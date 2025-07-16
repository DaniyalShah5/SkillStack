import express from 'express';
import {
  initializeChat,
  getUserChats,
  getMentorChats,
  getChatHistory
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/initialize', initializeChat);
router.get('/user/:userId', getUserChats);
router.get('/mentor/:mentorId', getMentorChats);
router.get('/history/:chatId', getChatHistory);

export default router;