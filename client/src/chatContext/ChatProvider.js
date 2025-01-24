import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Replaced useHistory with useNavigate



const ChatContext = createContext();


// interface ChatProviderProps {
//   children: React.ReactNode;
// }

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
   const [posts, setPosts] = useState([]);

  const navigate = useNavigate(); // useNavigate for React Router v6

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("userRole");

    const userInfo = {
      id,
      name,
      role
    }

    if (userInfo) {
      setUser(userInfo);
    } else {
        alert("no user info found")
      navigate("/"); // Redirect if no user info
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        posts,
        setPosts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
