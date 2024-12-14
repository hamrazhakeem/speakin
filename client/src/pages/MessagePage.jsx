import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'react-feather';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const MessagePage = () => {
  const location = useLocation();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [conversationPartners, setConversationPartners] = useState([]);

    const axiosInstance = useAxios();
    const { userId, accessToken } = useSelector((state) => state.auth);
    const tutorId = location.state?.tutor_id;
  
    useEffect(() => {
      const fetchConversations = async () => {
          try {
              const response = await axiosInstance.get(`messages/users/${userId}/`);
              console.log('response', response);
                const uniquePartners = new Set();
                const processedPartners = response.data.filter(message => {
                // Determine the partner based on whether sender or recipient is different from current user
                const partnerId = message.sender_id === userId 
                    ? message.recipient_id 
                    : message.sender_id;
                
                // Only add if not already seen
                if (!uniquePartners.has(partnerId)) {
                    uniquePartners.add(partnerId);
                    return true;
                }
                return false;
                });

                setConversationPartners(processedPartners.map(message => 
                message.sender_id === userId 
                    ? message.recipient_id 
                    : message.sender_id
                ));

                setConversations(response.data);
          } catch (error) {
              console.error('Error fetching conversations:', error);
          }
      };

      if (userId) {
        fetchConversations();
      }

      console.log(userId, tutorId)
      if (userId && tutorId) {
        console.log('this works')
          const chatId = `${tutorId}`;
          const newSocket = new WebSocket(`ws://127.0.0.1:8003/ws/chat/${chatId}/?token=${accessToken}`);

          newSocket.onopen = () => {
              console.log('WebSocket connected');
          };

          newSocket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              setMessages(prevMessages => [...prevMessages, data.message]);
          };

          newSocket.onclose = (event) => {
              console.log('WebSocket disconnected', event.code, event.reason);
          };

          newSocket.onerror = (error) => {
              console.error('WebSocket error:', error);
          };

          setSocket(newSocket);

          return () => {
              newSocket.close();
          };
      }else{
        console.log('not this works')
      }
  }, [userId, tutorId]);
  
    const sendMessage = () => {
      if (socket && inputMessage) {
        socket.send(JSON.stringify({ message: inputMessage }));
        setInputMessage('');
      }
    };

  return (
    <>
      {/* Navbar */}
      <Navbar />
        <div className="flex h-screen mt-16">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-1/4 bg-gray-100 border-r p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversations</h2>
                <ul className="space-y-4">
                    {conversationPartners.map((partnerId, index) => (
                    <li
                        key={`${partnerId}_${index}`}
                        className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                        navigate('/messages', { state: { tutor_id: partnerId } });
                        }}
                    >
                        User ID: {partnerId}
                    </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                <button
                    onClick={() => navigate('/')} // Navigate to Home or another route
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <MessageCircle className="h-5 w-5" />
                </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                    {/* Chat messages */}
                    {messages.map((message, index) => (
                    <div key={index} className="self-start max-w-xs p-3 bg-gray-200 rounded-lg mb-2">
                        {message}
                    </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center p-4 border-t">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
            </div>
        <Footer />
    </>
  );
};

export default MessagePage;