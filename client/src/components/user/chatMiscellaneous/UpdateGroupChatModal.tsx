import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../../chatContext/ChatProvider.js";
import UserBadgeItem from "../chatUserAvatar/UserBadgeItem";
import UserListItem from "../chatUserAvatar/UserListItem";
import { Dispatch, SetStateAction } from 'react';
import axiosInstance from "../../../utils/users/axiosInstance";



interface UpdateGroupChatModalProps {
  fetchMessages: () => void; // Define the type for fetchMessages function (assuming it's a function)
  fetchAgain: boolean;        // Define the type for fetchAgain (boolean)
  setFetchAgain: Dispatch<SetStateAction<boolean>>;  // Type for setFetchAgain (function to update state)
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const UpdateGroupChatModal = ({  fetchAgain, setFetchAgain, fetchMessages }: UpdateGroupChatModalProps) => {
   const userRole = localStorage.getItem('userRole');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${userRole}/chat/all-users?search=${search}`);
      // console.log("chatheader searchh result-----------1", response);
      console.log("chatheader searchh result-----------2", response.data);
      console.log("chatheader searchh result-----------3", response.data.users);

      console.log( response.data.users);
      setLoading(false);
      setSearchResult( response.data.users);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      
      const response = await axiosInstance.put(`/${userRole}/chat/rename`, {
        chatId: selectedChat?._id,
        chatName: groupChatName,
      });

      console.log(response.data.updatedChat._id);
      // setSelectedChat("");
      setSelectedChat(response.data.updatedChat);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error: any) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1: User) => {
    if (selectedChat.users.find((u: any) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    //  if (selectedChat.groupAdmin._id !== user._id) {
    //   toast({
    //     title: "Only admins can add someone!",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      
      const response = await axiosInstance.put(`/${userRole}/chat/group-add`, {
        chatId: selectedChat?._id,
        userId: user1._id,
      });

      setSelectedChat(response.data.added);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  const handleRemove = async (user1: User) => {
    console.log("selectedChat.groupAdmin._id", selectedChat.groupAdmin._id);
    console.log("user1._id", user1._id);
    console.log("user._id", user._id);
    

    // if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
    //   toast({
    //     title: "Only admins can remove someone!",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      
      const response = await axiosInstance.put(`/${userRole}/chat/remove-user`, {
        chatId: selectedChat?._id,
        userId: user1._id,
      });

      user1._id === user?.id ? setSelectedChat(null) : setSelectedChat(response.data.removed);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  
  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} aria-label="View Group Chat" />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {/* already joined users */}
              {selectedChat.users.map((u: any) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
                
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>


            {/* display search user */}
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user: any) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
