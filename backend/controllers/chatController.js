
import Chat from '../models/Chat.js';
import User from '../models/User.js';

export const initializeChat = async (req, res) => {
  try {
    const { userId } = req.body;
   
    const user = await User.findById(userId);
    if (!user?.chatPassActive) {
      return res.status(403).json({ error: 'ChatPass required' });
    }

    const mentor = await User.findOne({ role: 'mentor' });
    if (!mentor) {
      return res.status(500).json({ error: 'No mentors available in the system' });
    }

    const existingChat = await Chat.findOne({
      userId: userId,
      mentorId: mentor._id
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const chat = new Chat({
      userId,
      mentorId: mentor._id,
      messages: []
    });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId })
      .populate('mentorId', 'name email')
      .populate('userId', 'name email')
      .sort({ lastMessage: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMentorChats = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(403).json({ error: 'Unauthorized. Mentor access only.' });
    }

    const chats = await Chat.find({ mentorId })
      .populate('userId', 'name email')
      .populate('mentorId', 'name email')
      .sort({ lastMessage: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate('messages.sender', 'name email role');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    

    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      
    });

    socket.on('send-message', async ({ chatId, senderId, content }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;
    
        const message = {
          sender: senderId,
          content,
          timestamp: new Date(),
        };
    
        chat.messages.push(message);
        chat.lastMessage = new Date();
        await chat.save();
        io.to(chatId).emit('new-message', {
          ...message,
          chatId,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};