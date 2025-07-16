// ChatPass.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const ChatPass = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket Connection Setup
  useEffect(() => {
    if (!user?.chatPassActive) {
      navigate('/subscription');
      return;
    }

    const token = localStorage.getItem('token');
    const socket = io('http://localhost:4000', {
      auth: { token },
      withCredentials: true
    });

    socket.on('connect', () => {
      setIsConnected(true);
      // Request previous messages after connection
      socket.emit('get_previous_messages');
      setIsLoading(false);
    });

    socket.on('previous_messages', (prevMessages) => {
      setMessages(prevMessages);
      scrollToBottom();
    });

    socket.on('receive_message', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      setIsTyping(false);
    });

    socket.on('mentor_typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    socketRef.current = socket;
    return () => socket.disconnect();
  }, [user, navigate]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
      scrollToBottom()
    }, [messages]);

  // Message sending handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current) return;

    const messageData = {
      message: message.trim(),
      timestamp: new Date(),
      userId: user.id
    };

    socketRef.current.emit('send_message', messageData);
    setMessage('');
  };

  // Typing indicator handler
  const handleTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('user_typing');
    }
  }, []);

  // Time formatter
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (!user?.chatPassActive) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-violet-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">ChatPass Support</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-white">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex relative ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[70%] rounded-lg p-3 
                      ${msg.isFromUser 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-gray-100 text-gray-900'}
                    `}>
                      <div className="flex items-center gap-2">
                        {!msg.isFromUser && (
                          <span className="text-sm font-medium text-violet-600">
                            Mentor
                            
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className={`text-xs mt-1 ${msg.isFromUser ? 'text-violet-200' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-sm">Mentor is typing...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-violet-500 text-black"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!isConnected || !message.trim()}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

