import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import useAxios from '../../../../hooks/useAxios';
import Avatar from '../../../common/ui/Avatar';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';

const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // Time formatting options for 12-hour format
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true // This ensures 12-hour format with AM/PM
    };
    
    // Check if message is from today
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], timeOptions);
    }
    
    // Check if message is from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + messageDate.toLocaleTimeString([], timeOptions);
    }
    
    // For older messages, show date and time
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
  
    return messageDate.toLocaleDateString([], dateOptions) + ' ' + 
           messageDate.toLocaleTimeString([], timeOptions);
  };

const MessagesInterface = () => {
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const axiosInstance = useAxios();
    const { userId, accessToken } = useSelector((state) => state.auth);
    const location = useLocation();
    const initialTutorId = location.state?.tutor_id;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
    const [showUserList, setShowUserList] = useState(true);
    const isMobile = window.innerWidth <= 768;
  
    // Scroll to bottom of messages
    const messagesContainerRef = useRef(null);
  
    const onEmojiClick = (emojiObject) => {
      setInputMessage(prevInput => prevInput + emojiObject.emoji);
      // Remove the setShowEmojiPicker(false) line to keep the picker open
    };
  
    // Add this function to handle smooth scrolling
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        const scrollHeight = messagesContainerRef.current.scrollHeight;
        const height = messagesContainerRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        
        messagesContainerRef.current.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth'
        });
      }
    };
    
    // Add useEffect to handle scrolling when messages change
    useEffect(() => {
      if (messages.length > 0) {
        scrollToBottom();
      }
    }, [messages]);
    
    // Also scroll when a user is selected
    useEffect(() => {
      if (selectedUser) {
        scrollToBottom();
      }
    }, [selectedUser]);
  
    useEffect(() => {
      const fetchChatUsers = async () => {
        try {
          setLoading(true);
          
          // If we have an initialTutorId, fetch that tutor's details first
          if (initialTutorId) {
            const tutorResponse = await axiosInstance.get(`users/${initialTutorId}/`);
            const tutorData = tutorResponse.data;
            setChatUsers(prevUsers => {
              if (!prevUsers.find(user => user.id === tutorData.id)) {
                return [...prevUsers, tutorData];
              }
              return prevUsers;
            });
            handleUserSelect(tutorData); // Use handleUserSelect instead of setSelectedUser
          }
  
          // Then fetch existing chat users
          const messageResponse = await axiosInstance.get(`messages/chat-users/${userId}/`);
          const chatUserIds = messageResponse.data;
          
          // Fetch details for existing chat users
          if (chatUserIds.length > 0) {
            const userDetailsPromises = chatUserIds.map(id => 
              axiosInstance.get(`users/${id}/`)
            );
            
            const userResponses = await Promise.all(userDetailsPromises);
            const users = userResponses.map(response => response.data);
            
            setChatUsers(prevUsers => {
              const existingIds = prevUsers.map(user => user.id);
              const newUsers = users.filter(user => !existingIds.includes(user.id));
              return [...prevUsers, ...newUsers];
            });
          }
        } catch (error) {
          console.error('Error:', error);
          setError('Failed to load chat');
        } finally {
          setLoading(false);
        }
      };
    
      fetchChatUsers();
    }, [initialTutorId, userId]);
  
    useEffect(() => {
      if (selectedUser) {
        const setupChatConnection = () => {
          const wsUrl = `ws://127.0.0.1:8003/ws/chat/${selectedUser.id}/?token=${accessToken}`;
          const newSocket = new WebSocket(wsUrl);
    
          newSocket.onopen = () => {
            console.log('WebSocket connected');
            setError(null);
          };
          
          newSocket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              // Handle new messages
              if (data.message) {
                const displayMessage = {
                  content: data.message,
                  sender_id: data.sender_id,
                  recipient_id: selectedUser.id,
                  timestamp: new Date().toISOString()
                };
                setMessages(prevMessages => [...prevMessages, displayMessage]);
                scrollToBottom();
              }
              
              // Handle new conversation notifications
              if (data.type === 'new_conversation') {
                // Update chat users list if needed
                if (!chatUsers.find(user => user.id === data.user_id)) {
                  const fetchNewUser = async () => {
                    const response = await axiosInstance.get(`users/${data.user_id}/`);
                    setChatUsers(prevUsers => [...prevUsers, response.data]);
                  };
                  fetchNewUser();
                }
              }
            } catch (error) {
              console.error('Error processing message:', error);
            }
          };
        
          newSocket.onclose = () => {
            console.log('WebSocket disconnected');
            setError('Connection lost. Please refresh the page.');
          };
        
          newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Connection error. Please try again.');
          };
  
          setSocket(newSocket);
          return () => newSocket.close();
        };
  
        const fetchMessages = async () => {
          try {
          const response = await axiosInstance.get(
            `messages/history/${userId}/${selectedUser.id}/`
          );
          setMessages(response.data);
          // Add setTimeout to ensure DOM is updated before scrolling
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setError('Failed to load message history');
        }
      };
      const cleanup = setupChatConnection();
  
      fetchMessages();
      return cleanup;
      }
    }, [selectedUser, accessToken, userId]);
  
    // Add this new effect to handle real-time user list updates
    useEffect(() => {
      if (socket) {
        const handleNewConversation = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'new_conversation') {
              // Fetch the new user's details
              const fetchNewUser = async () => {
                try {
                  const response = await axiosInstance.get(`users/${data.user_id}/`);
                  const newUser = response.data;
                  setChatUsers(prevUsers => {
                    if (!prevUsers.find(user => user.id === newUser.id)) {
                      return [...prevUsers, newUser];
                    }
                    return prevUsers;
                  });
                } catch (error) {
                  console.error('Error fetching new user details:', error);
                }
              };
              fetchNewUser();
            }
          } catch (error) {
            console.error('Error processing new conversation:', error);
          }
        };
  
        socket.addEventListener('message', handleNewConversation);
        return () => socket.removeEventListener('message', handleNewConversation);
      }
    }, [socket, axiosInstance]);
  
    const sendMessage = () => {
      if (socket && inputMessage.trim() && selectedUser) {
        const messageData = {
          message: inputMessage.trim(), // Changed from 'content' to 'message' to match backend
        };
        socket.send(JSON.stringify(messageData));
        setInputMessage('');
      }
    };
  
    const BackButton = () => (
      <button
        onClick={() => setShowUserList(true)}
        className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
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
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
    );
    
    // Modify the user selection handler
    const handleUserSelect = async (user) => {
      setSelectedUser(user);
      if (isMobile) {
        setShowUserList(false); // Hide user list on mobile
      }
      
      // Fetch messages immediately to prevent showing empty state
      try {
        const response = await axiosInstance.get(
          `messages/history/${userId}/${user.id}/`
        );
        setMessages(response.data);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load message history');
      }
    };
    
    // Add this useEffect to handle clicks anywhere in the document
    useEffect(() => {
      const handleClickOutside = () => {
        // Close emoji picker when clicking anywhere outside of it
        if (showEmojiPicker) {
          setShowEmojiPicker(false);
        }
      };
  
      // Add event listener when emoji picker is shown
      if (showEmojiPicker) {
        document.addEventListener('click', handleClickOutside);
      }
  
      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [showEmojiPicker]);
  
    // Modify the emoji button click handler to stop event propagation
    const handleEmojiButtonClick = (e) => {
      e.stopPropagation(); // Prevent the click from bubbling up to document
      setShowEmojiPicker(!showEmojiPicker);
    };
  
    // Add this function to filter users based on search query
    const filteredChatUsers = chatUsers.filter(user => {
      const userName = user.user_type === 'student' 
        ? user.name.toLowerCase()
        : user.tutor_details.speakin_name.toLowerCase();
      return userName.includes(searchQuery.toLowerCase());
    });

  return (
    <div className="fixed inset-0 pt-16">
      <div className="flex h-full">
        <div 
          className={`${
            isMobile 
              ? `fixed inset-0 top-16 bg-white z-10 ${showUserList ? 'block' : 'hidden'}`
              : 'w-80 bg-white border-r border-gray-200'
          } flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner size="md" className='text-blue-600'/>
              </div>
            ) : filteredChatUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {chatUsers.length === 0 ? 'No conversations yet' : 'No matching conversations found'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChatUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150
                      ${selectedUser?.id === user.id 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                  >
                    <div className="relative">
                      <Avatar
                        src={user.profile_image}
                        name={user.user_type === 'student' ? user.name : user.tutor_details.speakin_name}
                        size={48}
                        className="rounded-full ring-2 ring-white"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {user.user_type === 'student' ? user.name : user.tutor_details.speakin_name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
  
        <div 
          className={`flex-1 flex flex-col h-[calc(100vh-4rem)] ${
            isMobile && showUserList ? 'hidden' : 'block'
          }`}
        >
        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <ChatBubbleLeftRightIcon className="w-64 h-64 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Select a conversation to start messaging</p>
            <p className="text-sm text-gray-400">Choose from your existing conversations</p>
          </div>
        ) : (
          <>
            <div className="flex items-center px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
                {isMobile && <BackButton />}
                <div className="flex items-center flex-1">
                  <div className="relative">
                    <Avatar
                      src={selectedUser.profile_image}
                      name={selectedUser.user_type === 'student' ? selectedUser.name : selectedUser.tutor_details.speakin_name}
                      size={40}
                      className="rounded-full ring-2 ring-white"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">
                      {selectedUser.user_type === 'student' ? selectedUser.name : selectedUser.tutor_details.speakin_name}
                    </h3>
                  </div>
                </div>
              </div>
  
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-thin"
                  >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p className="text-lg font-medium">Start a conversation</p>
                      <p className="text-sm text-gray-400">Send your first message to tutor {selectedUser.user_type === 'student' ? selectedUser.name : selectedUser.tutor_details.speakin_name}</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm
                            ${message.sender_id === userId
                              ? 'bg-blue-500 text-white ml-12'
                              : 'bg-white text-gray-700 mr-12'
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div 
                            className={`text-xs mt-1 
                              ${message.sender_id === userId 
                                ? 'text-blue-100' 
                                : 'text-gray-400'
                              }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
  
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                  <button
                    onClick={handleEmojiButtonClick}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    title="Add emoji"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </button>
                  
                  {showEmojiPicker && (
                    <div 
                      className="absolute bottom-12 left-0 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="shadow-lg rounded-lg">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          disableAutoFocus={true}
                          native
                        />
                      </div>
                    </div>
                  )}
                </div>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type a message..."
                  />
  
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className={`p-2 rounded-full transition-colors duration-200
                      ${inputMessage.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesInterface