import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
// import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../chatConfig/ChatLogics.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../user/chatMiscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../chatAnimations/typing.json";

import io from "socket.io-client";
import { Socket } from "socket.io-client"; // Import the Socket type
import UpdateGroupChatModal from "../user/chatMiscellaneous/UpdateGroupChatModal";
import { ChatState } from "../../chatContext/ChatProvider.js";
import axiosInstance from "../../utils/users/axiosInstance";
import { log } from "node:console";

const ENDPOINT = "http://localhost:3001"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket: Socket | undefined;
let selectedChatCompare: any;

interface SingleChatProps {
  fetchAgain: any; // since `admin` seems to be a boolean flag
  setFetchAgain: any;
}

interface Message {
  _id: string;
  // sender: { _id: string; name: string; pic: string };
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: {
      url: string;
    };
  };
  content: string;

  chatId: {
    _id: string;
    usersId: string[]; 
    lastMessageId: string;
    isGroupChat: string;
    chatName: string;
    groupAdminId: string;
  }
  seen: boolean;
  reactions: {
        userId: string;
        type: string
    }[];
  createdAt: string;
  // chatId: string;
}


const SingleChat: React.FC<SingleChatProps> = ({ fetchAgain, setFetchAgain }) => {

  const id = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const userRole = localStorage.getItem('userRole');
  const selectedChatId = localStorage.getItem("selectedChatId");
  console.log("selectedChatId from localstorage", selectedChatId);
  


  const userInfo = {
    _id :id,
    name,
    userRole
  }

  console.log("userInfo----11111!!!!!!!!!!!!!!!!!!", userInfo);
  
  

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  console.log("user in singlepage from chatState", user);
  console.log("selectedChat----11111!!!!!!!!!!!!!!!!!!", selectedChat);



  const fetchMessages = async () => {
    console.log("selected chat in single page----------------", selectedChat);
    console.log("selected chat id in single page----------------", selectedChat?._id);

    console.log("selectedChatId from localstrorage---", selectedChatId);  // chat id stored from localstorage

    if (!selectedChat) return;

    try {
      setLoading(true);

      const response = await axiosInstance.get(`/${userRole}/message/${selectedChatId}`);
      console.log("response in singlechat fetch all messages ----------------+++++++++++++++2", response.data.messages);
      
      setMessages(response.data.messages);
      setLoading(false);

      if (socket) {
        socket.emit("join chat", selectedChat._id); // Use socket safely
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

    useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", ()=> setSocketConnected(true) );
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  useEffect(() => {
    fetchMessages();
    
    selectedChatCompare = selectedChat; //just to keep a backup of selected chat data
  }, [selectedChat]);  // fetch again when select another chat those chat messages 

  console.log("notification in single chats----",notification)


  useEffect(() => {
    // socket = io(ENDPOINT);
    socket?.on("message recieved", (newMessageRecieved) => {
      console.log("Message received:*******************************", newMessageRecieved);

      console.log("selectedChatCompare", selectedChatCompare);
      console.log("selectedChat---ll", selectedChat);
      
      // console.log("selectedChatCompare._id", selectedChatCompare._id);
      // console.log("newMessageRecieved.chat._id", newMessageRecieved.chat._id);
      
      

      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) { // if chat is not selected or doesn't match current chat
        // give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }

    });
  });

  // const sendMessage = async (event: React.KeyboardEvent<HTMLInputElement>) => {

  const sendMessage = async (event: any) => {
    
    if (event.key === "Enter" && newMessage) {
      console.log("selected chat in send message================", selectedChat);
      socket?.emit("stop typing", selectedChat?._id);
      try {
        setNewMessage("");
        const response = await axiosInstance.post(`/${userRole}/message`, {
          content: newMessage,
          chatId: selectedChat._id,
        });

        console.log("data in sendMessage ---------singlechat-------1", response.data);
        console.log("data in sendMessage ---------singlechat-------2", response.data.messageData);

        socket?.emit("new message", response.data.messageData);
        setMessages([...messages, response.data.messageData]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };  



 


  console.log("selectedChatCompare out of useeffect@@@@@@@@@@@@@@@@@@@@@@@@@", selectedChatCompare);
  



  

  // const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return console.log("Socket not connected to track the typing state");
    
    if (!typing) {
      setTyping(true);
      socket?.emit("typing", selectedChat?._id);
    }

    // stop showing typing indicator after some seconds if they are not continuosly typing anymore
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket?.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };


  console.log("selectedChat in sinhlechat--", selectedChat)
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
              aria-label="Go back"
            />
            
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {/* shows current chat partner name in one on one chat */}
                  {/* {getSender(user, selectedChat.users)} */}
                  {selectedChat.users[1].firstName} {selectedChat.users[1].lastName}


                   {/* <ProfileModal
                    user={getSenderFull(user, selectedChat.usersId)}
                  />  */}
                {/* <ProfileModal user={getSenderFull(user, selectedChat.usersId)} > <Text>View Profile</Text> </ProfileModal>  */}
                </>
              ) : (
                <>                  
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
                <div className="messages">
                  {/* Messages */}
                <ScrollableChat messages={ messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* typing animation */}
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
