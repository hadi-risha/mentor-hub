import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../chatConfig/ChatLogics.js";  //-------------------------
import ChatLoading from "./ChatLoading";  //-------------------------
import GroupChatModal from "./chatMiscellaneous/GroupChatModal";  //-------------------------------
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../chatContext/ChatProvider.js";  //-----------------------------------
import axiosInstance from "../../utils/users/axiosInstance";
import { FaUserCircle } from 'react-icons/fa';


interface MyChatProps {
  fetchAgain: boolean; // since `admin` seems to be a boolean flag
}

interface User {
  _id: string;
  // name: string;
  firstName: string;
  lastName: string;
  role?: string;
  email: string;
  image: {
    url: string;
  };
}

// Last Message Interface
interface LastMessage {
  _id: string;
  content: string;
  createdAt: string; // Use Date if you plan to convert it to a Date object
  senderId?: User; // Populated sender details
}

// Chat Interface
interface Chat {
  _id: string;
  usersId: User[]; // List of users involved in the chat
  groupAdminId?: User; // Admin details if it's a group chat
  lastMessageId?: LastMessage; // Details of the last message
  isGroupChat: boolean;
  chatName: string;
  unreadCounts: { userId: string; count: number }[]; // Unread message counts per user
  updatedAt: string; // Timestamps
  createdAt: string; // Timestamps
}

// Chat List Response Interface
interface ChatListResponse {
  // message: string;
  chatList: Chat[];
}



// interface Chat {
//   _id: string;
//   isGroupChat: boolean;
//   chatName: string;
//   users: User[]; // Assuming User is another defined type
//   // lastMessageId?: {
//   //   _id: string;
//   //   content: string;
//   //   sender: {
//   //     name: string;
//   //   };
//   // };
//   lastMessageId: string;
// }

// interface NavbarChat {
//   _id: string;
//   usersId: string[]; // Assuming it's an array of user IDs
//   chatName: string | "";
//   isGroupChat: boolean;
//   lastMessageId: string | "";
//   lastMessageContent: string | "";
//   lastMessageSenderName: string | "";
// }



interface LoggedUser {
  _id: string | null;
  name: string | null;
  role: string | null;
}

const ChatNavbar: React.FC<MyChatProps> = ({ fetchAgain }) => {

  const id = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("userRole");

  const userInfo = {
    _id :id,
    name,
    role
  }


  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

//   const [navbarChats, setNavbarChats] = useState<ChatListResponse | null>(null);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const userRole = localStorage.getItem('userRole')

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const response: AxiosResponse<ChatListResponse> = await axiosInstance.get(`/${userRole}/chat`);
      console.log("data...get........myChat3", response.data.chatList);
    
      console.log("** navbar chats from chatProvider------", chats);
      console.log("** navbar response.data.chatList this is what i want to set in chats or setChats, so understand the type", response.data.chatList);


      // response.data.chatList.forEach((chat) => {
      //   console.log(`Chat ID: ${chat._id}`);

      //   chat.usersId.forEach((user) => {
      //     console.log(`User ID: ${user._id}`);
      //     console.log(`First Name: ${user.firstName}`);
      //     console.log(`Last Name: ${user.lastName}`);
      //     console.log(`Email: ${user.email}`);
      //     console.log(`Role: ${user.role}`);
      //     console.log(`Image URL: ${user.image.url}`);
      //   });
      //   console.log(`lastMessageId : ${chat.lastMessageId}`);

      //   if (chat.groupAdminId) {
      //     console.log(`Group Admin ID: ${chat.groupAdminId._id}`);
      //     console.log(`Admin First Name: ${chat.groupAdminId.firstName}`);
      //     console.log(`Admin Last Name: ${chat.groupAdminId.lastName}`);
      //     console.log(`Admin Email: ${chat.groupAdminId.email}`);
      //     console.log(`Admin Role: ${chat.groupAdminId.role}`);
      //     console.log(`Admin Image URL: ${chat.groupAdminId.image.url}`);
      //   }

      //   if (chat.lastMessageId) {
      //     console.log(`Last Message ID: ${chat.lastMessageId._id}`);
      //     console.log(`Last Message Content: ${chat.lastMessageId.content}`);
      //     console.log(`Last Message Created At: ${chat.lastMessageId.createdAt}`);
      //   }
      // });

      setChats(response?.data?.chatList);

    } catch (error) {
      console.log("error in chat-list mychats", error);
      
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (userInfo) {
      setLoggedUser(userInfo);
    }
    
    fetchChats();
  // eslint-disable-next-line
}, [fetchAgain]);


console.log("chats at the end of navbar-----------", chats)

  
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>


      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
         {chats?.length ? ( 
            // <Stack overflowY="scroll" className="pb-2">
              <Stack
                overflowY="scroll"
                className="pb-2"
                sx={{
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none', // For Firefox
                }}
              >
              {chats.map((chat: any) => {
                // console.log("Chat Details:------------------in jsx", chat);  

                return (
                  <Box
                    onClick={() => {
                      console.log("Selected Chat Details:", {
                        id: chat?._id,
                        name: chat?.isGroupChat ? chat?.chatName : getSender(loggedUser, chat?.users),
                      }); 

                      localStorage.setItem("selectedChatId", chat?._id);

                      // setSelectedChat({
                      //   _id: chat?._id,
                      //   users: chat?.users?.map((user: any) => user._id),
                      //   latestMessage: chat?.latestMessage?._id,
                      //   isGroupChat: chat?.isGroupChat,
                      //   chatName: chat?.chatName,
                      //   groupAdmin: chat?.groupAdmin?._id
                      // });
                      setSelectedChat(chat);
                    }}
                    
                    className={`cursor-pointer px-3 py-2 rounded-lg ${
                      selectedChat?._id === chat?._id ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                    
                    key={chat._id}
                  >
                    <Text className="flex gap-4">
                      {!chat?.isGroupChat ? (
                        <>
                          
                          {chat?.users[1]?.image?.url ? (
                            <img 
                              src={chat?.users[1]?.image.url} 
                              alt={`${chat?.users[1]?.firstName} ${chat?.users[1]?.lastName}`} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-8 h-8 text-white cursor-pointer" />
                          )}
                                              
                          {/* {`${chat?.users[1]?.firstName} ${chat?.users[1]?.lastName}`}  */}

                          {getSender(loggedUser, chat?.users)}
                        </>
                      ) : (
                        chat.chatName
                      )}
                    </Text>

                    {chat.latestMessage && (
                      <>
                        {console.log("lastMessageId details:", chat.latestMessage.sender)}
                        <Text fontSize="xs">
                          <span className="ml-12">
                           
                            {chat.latestMessage.content.length > 50
                              ? chat.latestMessage.content.substring(0, 51) + "..."
                              : chat.latestMessage.content}
                          </span>
                        </Text>
                      </>
                    )}
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}



      </Box>

      </Box>
    </>
  );
};

export default ChatNavbar;
