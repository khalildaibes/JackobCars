'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPopupProps {
  storeName?: string;
  chatUrl?: string;
  openOnRender?: boolean;
}

const ChatPopup = ({ storeName, chatUrl, openOnRender = false }: ChatPopupProps) => {
  const [isOpen, setIsOpen] = useState(openOnRender);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { 
      text: "Hello! Welcome to our car dealership. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChat = () => {
    setMessages([
      { 
        text: storeName
          ? `Hi! I'm ${storeName}'s assistant. How can I help you today?`
          : "Hello! Welcome to our car dealership. How can I help you today?",
        sender: 'bot'
      }
    ]);
    setIsOpen(true);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = inputMessage.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            chatUrl: chatUrl
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from chat service');
        }

        const data = await response.json();
        if (!data?.message) throw new Error("Invalid API response structure");
        setMessages(prev => [...prev, { 
          text: data.message || "Sorry, I couldn't process your request", 
          sender: 'bot' 
        }]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { 
          text: "Failed to get response from chat service", 
          sender: 'bot' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpenChat}
        className="fixed z-50 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform
          left-4 bottom-20 sm:left-8 sm:bottom-8
          w-14 h-14 flex items-center justify-center
        "
        style={{
          // On mobile, place above nav; on desktop, bottom-8
        }}
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-white rounded-lg shadow-xl flex flex-col
              w-[90vw] max-w-xs sm:w-80 sm:max-w-sm md:max-w-md md:w-80 lg:w-96
              left-4 bottom-36 sm:left-8 sm:bottom-24
            "
          >
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">{storeName ? `Chat with ${storeName}` : 'Chat with us'}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
};

export default ChatPopup; 
 