import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../../chatContext/ChatProvider.js";
import UserBadgeItem from "../chatUserAvatar/UserBadgeItem";
import UserListItem from "../chatUserAvatar/UserListItem";
import axiosInstance from "../../../utils/users/axiosInstance";


interface GroupChatModalProps {
  children: React.ReactNode;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  image: { url: string };
  email: string;
  role: string;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const userRole = localStorage.getItem("userRole");

  const { user, chats, setChats } = ChatState();

  const handleGroup = async (userToAdd: User): Promise<void> => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      

      const response = await axiosInstance.get(`/${userRole}/chat/all-users?search=${search}`);
      // console.log("chatheader searchh result-----------1", response);
      console.log("response in group chat modal---1", response.data);
      console.log("response in group chat modal-----------2", response.data.users);
      // const users = response.data.users || [];
      setLoading(false);
      setSearchResult(response.data.users);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser: User) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };


  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const dataToSend = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)), // Converting user IDs to a JSON string
      };
      const response = await axiosInstance.post(`/${userRole}/chat/new-group`, dataToSend);
      console.log("response.data 1 ", response.data);
      console.log("response.data.fullGroupChat 2", response.data.fullGroupChat);
      
      setChats([response.data.fullGroupChat, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  

   return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Sara, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  // user={{ _id: u._id, name: `${u?.firstName} ${u?.lastName}` }} // Ensure compatibility with `id`-based components
                  user={u}
                  handleFunction={() => handleDelete(u)}
                  admin={user?.id || ""} 
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue"
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
