import { Box } from "@chakra-ui/layout"; 
import { useState } from "react";
import Chatbox from "../../components/user/Chatbox";
import ChatNavbar from "../../components/user/ChatNavbar";
import ChatHeader from "../../components/user/chatMiscellaneous/ChatHeader";
import { ChatState } from "../../chatContext/ChatProvider.js";

const StudentChat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();  //from chatprovider

  return (
    <div className="w-full">
      {user && <ChatHeader />} 

      <Box className="flex justify-between w-full h-[75vh] p-2.5">

        {user && <ChatNavbar fetchAgain={fetchAgain} />}  
        
        {/* chat section */}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default StudentChat;
