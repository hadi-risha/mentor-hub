import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../../chatContext/ChatProvider.js";
import { FaUserCircle } from 'react-icons/fa';

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: { url: string };
  role: string;
}

interface UserListItemProps {
  user?: IUser;
  handleFunction: () => Promise<void>; 
}

const UserListItem: React.FC<UserListItemProps> = ({ user, handleFunction }) => {
  console.log("ChatHeader coming user in UserListItem--------", user);
  
  console.log("handleFunction inUserListItem--------", handleFunction);

  console.log("user in user list item :- ", user);
  
  
    
  // const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      
      {user?.image?.url ? (
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={`${user?.firstName} ${user?.lastName}`}
          src={user?.image?.url}
        />
      ) : (
        <FaUserCircle className="w-8 h-8 mr-2 text-white cursor-pointer" />
      )}

      <Box>
        <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user?.email}
        </Text>
      </Box>
      
    </Box>
  );
};

export default UserListItem;
