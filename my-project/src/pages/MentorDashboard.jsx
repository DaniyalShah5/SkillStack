import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MessageCircle, Send, Users, ArrowLeft } from 'lucide-react';

const MentorDashboard = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  
  useEffect(() => {
    if (socket) {
      socket.on('new-message', (newMessage) => {
        console.log('Received new message:', newMessage);
        
        if (newMessage.sender !== user.id) {
          setMessages(prev => [...prev, newMessage]);
          
          
          if (!currentChat || newMessage.chatId !== currentChat._id) {
            setUnreadCounts(prev => ({
              ...prev,
              [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
            }));
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('new-message');
      }
    };
  }, [socket, currentChat, user.id]);

  
  useEffect(() => {
    if (user?.id) {
      fetchActiveChats();
    }
  }, [user?.id]);

  
  useEffect(() => {
    if (currentChat) {
      fetchChatHistory();
      if (socket) {
        socket.emit('join-chat', currentChat._id);
      }
      
      setUnreadCounts(prev => ({
        ...prev,
        [currentChat._id]: 0
      }));
    }
  }, [currentChat]);

  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchActiveChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/chat/mentor/${user.id}`);
      console.log('Fetched active chats:', response.data);
      setActiveChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to load active chats');
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!currentChat?._id) return;

    try {
      const response = await axios.get(`http://localhost:4000/api/chat/history/${currentChat._id}`);
      console.log('Fetched chat history:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    const currentMessage = message;
    setMessage(''); 

    try {
      
      const newMessage = {
        sender: user.id,
        content: currentMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);

      
      if (socket) {
        socket.emit('send-message', {
          chatId: currentChat._id,
          senderId: user.id,
          content: currentMessage
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      setMessage(currentMessage); 
      
      
      setMessages(prev => prev.filter(msg => msg.content !== currentMessage));
    }
  };

 

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Active Chats Sidebar */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Active Chats
          </h2>
        </div>
        
        <div className="divide-y">
          {activeChats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => setCurrentChat(chat)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors relative ${
                currentChat?._id === chat._id ? 'bg-violet-50' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-900">
                  {chat.userId?.name || 'User'}
                </div>
                {unreadCounts[chat._id] > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCounts[chat._id]}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {chat.lastMessage ? new Date(chat.lastMessage).toLocaleString() : 'No messages yet'}
              </div>
            </button>
          ))}
          {activeChats.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-500">
              No active chats
            </div>
          )}
          {loading && (
            <div className="p-4 text-center text-gray-500">
              Loading chats...
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => setCurrentChat(null)} 
                  className="mr-4 lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentChat.userId?.name || 'User'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Messages */}
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
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Toast */}
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

export default MentorDashboard;