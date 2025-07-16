import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';


const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

class SocketService {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "https://lambent-dasik-e1878e.netlify.app",
        credentials: true
      },
      pingTimeout: 60000
    });

    this.activeUsers = new Map();
    this.activeMentors = new Map();
    this.userTypingStatus = new Map();
    this.setupSocketServer();
  }

  setupSocketServer() {
    this.io.use(this.authMiddleware);
    this.io.on('connection', (socket) => this.handleConnection(socket));
  }

  authMiddleware = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Authentication token required');

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('name email role chatPassActive');

      if (!user) throw new Error('User not found');
      if (!user.chatPassActive && user.role !== 'mentor') {
        throw new Error('ChatPass not active');
      }

      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      };
      next();
    } catch (error) {
      next(new Error(`Authentication failed: ${error.message}`));
    }
  };

  handleConnection(socket) {
    
    
    if (socket.user.role === 'mentor') {
      this.handleMentorConnection(socket);
    } else {
      this.handleUserConnection(socket);
    }

    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  async handleMentorConnection(socket) {
    const mentor = {
      id: socket.user.id,
      name: socket.user.name,
      activeChats: new Set()
    };
    
    this.activeMentors.set(socket.id, mentor);
    socket.join('mentors');

    const activeChats = await this.getActiveChats();
    socket.emit('active_chats', activeChats);

    socket.on('join_chat', async ({ userId }) => {
      try {
        mentor.activeChats.forEach(chatId => {
          if (chatId !== userId) socket.leave(chatId);
        });
        mentor.activeChats = new Set([userId]);
        socket.join(userId);

        const messages = await this.loadChatHistory(userId);
        socket.emit('previous_messages', messages);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    socket.on('mentor_message', async (data) => {
      try {
        const message = await this.saveMentorMessage(socket.user, data);
        this.io.to(data.userId).emit('receive_message', message);
        await this.updateActiveChatsList();
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('mentor_typing', ({ userId }) => {
      this.io.to(userId).emit('mentor_typing');
    });
  }

  handleUserConnection(socket) {
    const userId = socket.user.id;
    this.activeUsers.set(socket.id, {
      id: userId,
      name: socket.user.name
    });

    socket.join(userId);

    this.loadChatHistory(userId)
      .then(messages => socket.emit('previous_messages', messages))
      .catch(error => socket.emit('error', { message: 'Failed to load chat history' }));

    this.io.to('mentors').emit('user_connected', {
      userId,
      userName: socket.user.name
    });

    socket.on('send_message', async (data) => {
      try {
        const message = await this.saveUserMessage(socket.user, data);
        this.broadcastMessage(userId, message);
        await this.updateActiveChatsList();
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('user_typing', () => {
      if (this.userTypingStatus.has(userId)) {
        clearTimeout(this.userTypingStatus.get(userId));
      }
      
      this.io.to('mentors').emit('user_typing', { userId });
      
      const timeout = setTimeout(() => {
        this.io.to('mentors').emit('user_stop_typing', { userId });
        this.userTypingStatus.delete(userId);
      }, 3000);
      
      this.userTypingStatus.set(userId, timeout);
    });
  }

  handleDisconnect(socket) {
    
    
    if (socket.user.role === 'mentor') {
      this.activeMentors.delete(socket.id);
    } else {
      this.activeUsers.delete(socket.id);
      const userId = socket.user.id;
      if (this.userTypingStatus.has(userId)) {
        clearTimeout(this.userTypingStatus.get(userId));
        this.userTypingStatus.delete(userId);
      }
    }
    
    this.updateActiveChatsList();
  }

  async loadChatHistory(userId) {
    try {
      const messages = await Message.find({ userId })
        .sort({ timestamp: 1 })
        .limit(100)
        .lean();

      return messages.map(msg => ({
        id: msg._id.toString(),
        message: msg.content,
        sender: msg.isFromUser ? msg.userName : msg.mentorName,
        timestamp: msg.timestamp,
        isFromUser: msg.isFromUser,
        isMentor: !msg.isFromUser
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      throw error;
    }
  }

  async saveMentorMessage(mentor, data) {
    const message = await Message.create({
      userId: data.userId,
      content: data.message,
      isFromUser: false,
      mentorId: mentor.id,
      mentorName: mentor.name,
      timestamp: new Date()
    });

    return {
      id: message._id.toString(),
      message: message.content,
      sender: mentor.name,
      timestamp: message.timestamp,
      isFromUser: false,
      isMentor: true
    };
  }

  async saveUserMessage(user, data) {
    const message = await Message.create({
      userId: user.id,
      content: data.message,
      isFromUser: true,
      userName: user.name,
      timestamp: new Date()
    });

    return {
      id: message._id.toString(),
      message: message.content,
      sender: user.name,
      timestamp: message.timestamp,
      isFromUser: true,
      isMentor: false
    };
  }

  broadcastMessage(userId, message) {
    this.io.to(userId).emit('receive_message', message);
    this.io.to('mentors').emit('receive_message', {
      ...message,
      userId
    });
  }

  async updateActiveChatsList() {
    try {
      const activeChats = await this.getActiveChats();
      this.io.to('mentors').emit('active_chats', activeChats);
    } catch (error) {
      console.error('Error updating active chats list:', error);
    }
  }

  async getActiveChats() {
    const recentMessages = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$userId',
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$isFromUser', true] }, 1, 0]
            }
          }
        }
      }
    ]);

    const chats = await Promise.all(
      recentMessages.map(async (chat) => {
        const user = await User.findById(chat._id).select('name email').lean();
        if (!user) return null;

        const isActive = Array.from(this.activeUsers.values())
          .some(activeUser => activeUser.id === chat._id.toString());

        return {
          userId: chat._id.toString(),
          userName: user.name,
          userEmail: user.email,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageTime,
          unreadCount: chat.unreadCount,
          isActive
        };
      })
    );

    return chats.filter(chat => chat !== null)
      .sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }
}

export const createSocketService = (httpServer) => new SocketService(httpServer);