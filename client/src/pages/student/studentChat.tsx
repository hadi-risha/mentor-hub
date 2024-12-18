import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { FaSearch } from 'react-icons/fa';



// interface Message {
//     text: string;
//     sender: 'user1' | 'user2';
//     timestamp: string;
//     read: boolean;
// }
  
// const messages: Message[] = [
//     { text: 'Hey, how are you?', sender: 'user1', timestamp: '12:00 PM', read: true },
//     { text: 'I am good, thanks! How about you?', sender: 'user2', timestamp: '12:01 PM', read: true },
//     { text: 'I am doing well too.', sender: 'user1', timestamp: '12:02 PM', read: true },
//     { text: 'Great to hear!', sender: 'user2', timestamp: '12:03 PM', read: false },
//     { text: 'Hey, how are you?', sender: 'user1', timestamp: '12:00 PM', read: true },
//     { text: 'I am good, thanks! How about you?', sender: 'user2', timestamp: '12:01 PM', read: true },
//     { text: 'I am doing well too.', sender: 'user1', timestamp: '12:02 PM', read: true },
// ];


interface IChat {
    _id: string;
    usersId: {
      _id: string;
      firstName: string;
      lastName: string;
      role: string;
      image: { url: string };
    }[];
    lastMessageId: {
      _id: string;
      content: string;
      timestamp: string;
      seen: boolean;
      senderId: string;
    };
    unreadCounts: { userId: string; count: number }[];
  }

  interface IMessage {
    _id: string;
    senderId: { _id: string; name: string };
    receiverId: { _id: string; name: string };
    content: string;
    reactions: { userId: string; type: string }[];
    seen: boolean;
    timestamp: string;
  }

  interface ISelectedChat {
    chat: IChat | null;
    messages: IMessage[] | null;
  }

  interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    image: { url: string };
  }
const StudentChat: React.FC = () => {
    const userRole = localStorage.getItem('userRole');
    const [profileData, setProfileData] = useState({
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        profilePic: '',
    });

    const id = localStorage.getItem('')
    const [chatList, setChatList] = useState<IChat[]>([]); // State for chat list
    const [loading, setLoading] = useState<boolean>(true);

    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const [selectedChatMessages, setSelectedChatMessages] = useState<IMessage[]>([]);
    const [selectedChatId, setSelectedchatId] = useState();

    const [chatPartnerId, setChatPartnerId] = useState<string | undefined>();    
    const [chatPartnerData, setChatPartnerData] = useState<IUser | null>(null);


    
    useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await axiosInstance.get(`/${userRole}/profile`);
            const { email, role,  firstName, lastName, profilePicUrl } = res.data;
    
            setProfileData({
              email: email || '',
              role: role || '',
              firstName: firstName || '',
              lastName: lastName || '',
              profilePic: profilePicUrl || '',
            });
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
        fetchProfile();
      }, []);

    
    //   scroll down function
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
            console.log(`ScrollTop: ${scrollTop}, ClientHeight: ${clientHeight}, ScrollHeight: ${scrollHeight}, isAtBottom: ${isBottom}`);
            setIsAtBottom(isBottom); // Update state based on scroll position
        }
    };

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [selectedChatMessages]);


    // useEffect(() => {
    //     if (chatContainerRef.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    //         const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    //         setIsAtBottom(isBottom);
    //     }
    // }, [messages]);



    // Function to handle emoji selection
    const handleEmojiClick = (emoji: string) => {
        setMessage((prevMessage) => prevMessage + emoji); // Add emoji to message input
    };

    // Function to toggle emoji picker visibility
    const toggleEmojiPicker = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the click from propagating to document
        setShowEmojiPicker((prev) => !prev);
    };

    // Close emoji picker if clicked outside the input field or emoji picker, or if the input field is focused
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        // If the click is outside the emoji picker container and the input field
        if (
            emojiPickerRef.current &&
            !emojiPickerRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
        ) {
            setShowEmojiPicker(false); // Close emoji picker if clicked outside
        }
        };

        const handleFocusInput = () => {
            setShowEmojiPicker(false); // Close emoji picker when input field is focused
        };

        document.addEventListener('click', handleClickOutside);
        if (inputRef.current) {
            inputRef.current.addEventListener('focus', handleFocusInput); // Close on focus
        }

        // Cleanup event listeners
        return () => {
            document.removeEventListener('click', handleClickOutside);
            if (inputRef.current) {
                inputRef.current.removeEventListener('focus', handleFocusInput);
            }
        };
    }, []);



    useEffect(() => {
        const fetchChatList = async () => {
          try {
           
            const response = await axiosInstance.get(`/${userRole}/chat-list`);
            console.log("Full response:", response);
            console.log("Chat list:", response.data.chatList);
      
            // Ensure the data is set correctly
            if (response.status === 200 && response.data.chatList) {
              setChatList(response.data.chatList); // Assuming `setChatList` updates the state
            }
          } catch (error) {
            console.error('Error fetching chat list:', error);
          } finally {
            setLoading(false); // Update the loading state
          }
        };
      
        fetchChatList();
    }, []);


    const fetchChatDetails = async (chatPartnerId: string) => {
        setChatPartnerId(chatPartnerId)
        console.log("Fetching chat details for:------------------------", chatPartnerId);
    
        try {

             
            const response = await axiosInstance.get(`/${userRole}/chat`, {
                params: { chatPartnerId }, // Pass it as a query parameter
            });
            if (response.status === 200) {
                // Update state with messages
                setSelectedChatMessages(response.data.messages);
                setSelectedchatId(response.data.chat._id)
                console.log("Fetched messages:---", response.data.messages);

            }

            console.log("response.data.chat._id", response.data.chat._id);
            console.log("response.data.chat 00000", response.data.chat);
           
            // 67629e62c82c3de2753a6c05 chat id
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };


    useEffect(() => {
        if (selectedChatMessages.length > 0) {
            selectedChatMessages.forEach((chat, i) => {
                console.log(`Logged from state - Message ${i + 1}:`, chat.content);
            });
        }
    }, [selectedChatMessages]);
    


    console.log("selectedChatId------,,..", selectedChatId);


    function formatTimestamp(isoTimestamp: string): string {
        const date = new Date(isoTimestamp);
        const options: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
        return date.toLocaleTimeString(undefined, options); // Use the user's locale
      }


    useEffect(() => {
        if (chatPartnerId) {
          // Find the chat that includes the chatPartnerId
          const partner = chatList.find(chat =>
            chat.usersId.some(user => user._id === chatPartnerId)
          );
    
          // Find the specific user data for the chatPartnerId
          const partnerData = partner?.usersId.find(user => user._id === chatPartnerId);
    
          setChatPartnerData(partnerData || null);
        }
      }, [chatPartnerId, chatList]);


      const handleSubmitMessage = async () => {
        if (!message.trim()) {
        //   alert('Message cannot be empty!');
          console.log("Message cannot be empty!");
          return;
        }
    
        try {
        

          const response = await axiosInstance.post(`/${userRole}/chat`, { chatPartnerId, content: message });

          console.log('Message sent successfully:', response.data);
    
          // Clear the input field after sending
          setMessage('');
          if (inputRef.current) inputRef.current.focus();
        } catch (error: any) {
          console.error('Error sending message:', error.response?.data || error.message);
          alert('Failed to send the message.');
        }
      };
    

    return (
        <div className="w-screen h-screen bg-gray-200 flex justify-center pt-4">
        <div className="w-8/12 h-5/6 bg-white rounded-xl text-center shadow-lg flex">
            <div className="w-4/12 rounded-tl-xl rounded-bl-xl bg-navy-blue flex-grow"> 
                
                <div className='px-5 py-6 mb-7 h-16 flex space-x-6 border-b border-gray-400'>
                    <p className='text-lg font-semibold'>Chats</p>
                    
                    <div className="px-2 py-2 w-52 h-7 flex items-center bg-white rounded-full gap-x-1">
                        <input
                            type="text"
                            className="search-input flex-shrink bg-white text-sm text-black focus:outline-none placeholder-gray-400 placeholder:text-xs w-full"
                            placeholder="Search..."
                        />
                        <button type="submit" className="search-button px-3 py-1 rounded-full text-black hover:bg-gray-200">
                            <FaSearch className="ml-1 mt-0 size-3 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* NAVBAR CHATLIST */}
                <div className="h-[455px] py-3 flex flex-col overflow-y-auto"> 
                    {chatList.map((chat, index) => (
                        <div
                            key={chat._id || index}
                            className="h-auto py-3 pl-10 flex items-center border-b border-gray-700 relative cursor-pointer"
                            onClick={() => fetchChatDetails(chat.usersId[0]?._id)}
                        >
                            {/* User Avatar */}
                            <img
                                src={
                                    chat.usersId[0]?.image?.url || 
                                    "https://via.placeholder.com/40?text=No+Image" // Fallback image URL
                                }
                                alt={chat.usersId[0]?.firstName || "User"}
                                className="object-cover w-10 h-10 rounded-full"
                            />
                            {/* <p className='text-black'>{chat.usersId[0]?._id}</p> */}
                            
                            <p className="ml-3 font-medium font-serif text-gray-300">
                                {`${chat.usersId[0]?.firstName || "Unknown"} ${chat.usersId[0]?.lastName || ""}`}
                            </p>
                            
                            {/* Unread Message Count */}
                            {chat.unreadCounts[0]?.count > 0 && (
                                <div className="ml-auto mr-6 w-auto h-6 px-2 rounded-full text-black bg-[#3ee1a6] flex items-center justify-center">
                                    <p className="text-xs m-0">{chat.unreadCounts[0].count}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>


            {/* MESSAGE SECTION */}
            <div className="w-8/12 rounded-tr-xl rounded-br-xl bg-white flex-grow">
                {/* <div className="h-16 pt-3 pl-10 flex space-x-3 border-b border-gray-500"> */}
                <div
                    className={`h-16 pt-3 pl-10 flex space-x-3 ${
                        chatPartnerData ? "border-b border-gray-500" : ""
                    }`}
                    >

                    {chatPartnerData ? (
                        <>
                            <img src={chatPartnerData?.image.url} alt="" className="object-cover w-10 h-10 rounded-full" />
                            <div>
                                <p className=" font-medium font-serif text-black">{chatPartnerData.firstName} {chatPartnerData.lastName}</p>
                                <p className="-ml-14 font-light text-sm text-gray-500">{chatPartnerData.role}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500"></p>
                    )}
                </div>

                    {/* Chat messages area */} 
                    <div className="relative h-4/5 bg-white p-4 overflow-auto" ref={chatContainerRef} onScroll={handleScroll}>
                        <div className="space-y-4">
                            { chatPartnerData && selectedChatMessages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">No chat found for these users</div>
                            ) : (
                                selectedChatMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        ref={index === selectedChatMessages.length - 1 ? lastMessageRef : null}
                                        className={`flex items-start space-x-4 ${message?.senderId?._id === chatPartnerId ? "justify-start" : "justify-end"}`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center ${message?.senderId?._id !== chatPartnerId ? "order-last" : ""}`}
                                        >

                                            <img
                                                src={message?.senderId?._id === chatPartnerId ? chatPartnerData?.image.url : profileData?.profilePic}
                                                alt="User Profile"
                                                className="object-cover w-full h-full rounded-full"
                                            />
                                        </div>
                                        <div className={`flex flex-col ${message?.senderId?._id === chatPartnerId ? "items-start" : "items-end"}`}>
                                            <div className={`max-w-xs p-3 rounded-lg break-words ${message?.senderId?._id === chatPartnerId ? "bg-[#DC225D] text-white text-sm" : "bg-[#F8EDF0] text-black text-sm mr-4"}`}>
                                                <p>{message.content}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                {/* <span>{message.timestamp}</span> */}
                                                <span>{formatTimestamp(message.timestamp)}</span>
                                                <span className="flex items-center">
                                                    {message.seen ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="26" viewBox="0 0 24 24" fill="#007bff" className='mr-4'>
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" transform="translate(5, 0)" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="26" viewBox="0 0 24 24" fill="currentColor" className='mr-4'> 
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" transform="translate(5, 0)" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}



                            
                        </div>

                        {/* Scroll down button */}
                        {!isAtBottom && (
                            <button
                                className="fixed bottom-48 left-3/5 transform -translate-x-1/2 w-10 h-10 bg-gray-400 text-white px-2 py-2 rounded-full shadow-lg"
                                onClick={scrollToBottom}
                            >
                                ↓
                            </button>
                        )}


                        {!chatPartnerData ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Select a chat to start messaging</p>
                            </div>
                            ) : (
                            <div>
                            </div>
                        )}
                    </div>


                    {/* Input section with icons */}
                    {chatPartnerData ? (
                    <div className="py-2 pl-10 flex space-x-3">
                        <div className="relative flex items-center w-11/12">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2 w-6 h-6 text-gray-500 hover:text-gray-700"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486L18 13"
                            />
                        </svg>

                        {/* Emoji Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            className="mr-4 cursor-pointer"
                            onClick={toggleEmojiPicker} // Toggle emoji picker
                        >
                            <g fill="none" stroke="#645f5f" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10"></path>
                            <path d="M16.5 14.5s-1.5 2-4.5 2s-4.5-2-4.5-2"></path>
                            <path fill="#645f5f" d="M15.5 9a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m-7 0a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1"></path>
                            </g>
                        </svg>

                        {/* Input Field */}
                        <input
                            ref={inputRef} // Add ref to input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                            className="w-full px-4 py-2 text-black pr-10 border border-gray-300 rounded-lg focus:outline-none"
                        />

                        {/* Send Button */}
                        <button className="absolute right-2" onClick={handleSubmitMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 15 15">
                            <path fill="navy-blue" d="M14.954.71a.5.5 0 0 1-.1.144L5.4 10.306l2.67 4.451a.5.5 0 0 0 .889-.06zM4.694 9.6L.243 6.928a.5.5 0 0 1 .06-.889L14.293.045a.5.5 0 0 0-.146.101z"></path>
                            </svg>
                        </button>
                        </div>
                    </div>
                    ) : (
                        <p className='text-black'></p>
                    )}

                    {/* Emoji Picker - Simple example */}
                    {showEmojiPicker && (
                        <div 
                            ref={emojiPickerRef} // Add ref to emoji picker
                            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 p-1 rounded-lg shadow-lg flex flex-wrap gap-1 max-w-[200px] sm:max-w-[250px]"
                        >
                            <button onClick={() => handleEmojiClick('😊')}>😊</button>
                            <button onClick={() => handleEmojiClick('😂')}>😂</button>
                            <button onClick={() => handleEmojiClick('😍')}>😍</button>
                            <button onClick={() => handleEmojiClick('😎')}>😎</button>
                            <button onClick={() => handleEmojiClick('😭')}>😭</button>
                            <button onClick={() => handleEmojiClick('🥺')}>🥺</button>
                            <button onClick={() => handleEmojiClick('😅')}>😅</button>
                            <button onClick={() => handleEmojiClick('😜')}>😜</button>
                            <button onClick={() => handleEmojiClick('😇')}>😇</button>
                            <button onClick={() => handleEmojiClick('🤔')}>🤔</button>
                            <button onClick={() => handleEmojiClick('😉')}>😉</button>
                            <button onClick={() => handleEmojiClick('😋')}>😋</button>
                            <button onClick={() => handleEmojiClick('😴')}>😴</button>
                            <button onClick={() => handleEmojiClick('😜')}>😜</button>
                            <button onClick={() => handleEmojiClick('💪')}>💪</button>
                            <button onClick={() => handleEmojiClick('🤩')}>🤩</button>
                            <button onClick={() => handleEmojiClick('🥳')}>🥳</button>
                            <button onClick={() => handleEmojiClick('🥺')}>🥺</button>
                            <button onClick={() => handleEmojiClick('🤗')}>🤗</button>
                            <button onClick={() => handleEmojiClick('😱')}>😱</button>
                            <button onClick={() => handleEmojiClick('🤡')}>🤡</button>
                      </div>
                      
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentChat;
