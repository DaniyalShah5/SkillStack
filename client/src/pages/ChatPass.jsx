import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MessageCircle, Send } from 'lucide-react';

const ChatInterface = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  
  useEffect(() => {
    if (socket) {
      socket.on('new-message', (newMessage) => {
        
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      });
    }
  }, [socket]);

  
  useEffect(() => {
    if (user?.id) {
      initializeOrFetchChat();
    }
  }, [user?.id]);

  
  useEffect(() => {
    if (currentChat && socket) {
      socket.emit('join-chat', currentChat._id);
      fetchChatHistory();
    }
  }, [currentChat, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeOrFetchChat = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/user/${user.id}`);
      
      if (response.data && response.data.length > 0) {
        
        setCurrentChat(response.data[0]);
      } else {
        
        const newChatResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chat/initialize`, {
          userId: user.id
        });
        setCurrentChat(newChatResponse.data);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/history/${currentChat._id}`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      setError('Failed to load chat history');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    const messageContent = message;
    setMessage(''); 

    try {
      if (socket) {
        socket.emit('send-message', {
          chatId: currentChat._id,
          senderId: user.id,
          content: messageContent
        });
      }
    } catch (error) {
      setError('Failed to send message');
      setMessage(messageContent); 
    }
  };

  if (!user?.chatPassActive) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <MessageCircle className="w-16 h-16 text-violet-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ChatPass Required</h2>
          <p className="text-gray-600 mb-6">
            You need an active ChatPass subscription to chat with mentors.
          </p>
          <a
            href="/subscription"
            className="inline-block px-6 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Get ChatPass
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen p-4 bg-gray-50">
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Chat with {currentChat?.mentorId?.name || 'Mentor'}
          </h3>
          <p className="text-sm text-gray-500">
            Get help with your web development questions
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === user.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;