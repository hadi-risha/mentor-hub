import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat.jsx";  //-------------------------------------
import { ChatState } from "../../chatContext/ChatProvider.js";  //-------------------------
import { Dispatch, SetStateAction } from "react";


interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}

const Chatbox = ({ fetchAgain, setFetchAgain }: ChatboxProps) => {

  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
