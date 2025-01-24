import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage.jsx";

const Friend = ({ friendId, name, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { _id } = useSelector((state) => state.user);
  // const token = useSelector((state) => state.token);
  // const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // const isFriend = friends.find((friend) => friend._id === friendId);
  // const isFriend = Array.isArray(friends) 
  //                   ? friends.find((friend) => friend._id === friendId)
  //                   : null;

  // console.log("friends", friends);
  // console.log("arr or not",  Array.isArray(friends));

  const patchFriend = async () => {
    console.log("is it the add friend function----------------------------------");
    
    // const response = await fetch(
    //   `http://localhost:4000/users/${_id}/${friendId}`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const data = await response.json();
    // dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
        // onClick={() => {
        //   navigate(`/profile/${friendId}`);
        //   navigate(0);
        // }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            // sx={{
            //   "&:hover": {
            //     color: palette.primary.light,
            //     cursor: "pointer",
            //   },
            // }}
          >
            {name}
            <p className="text-gray-400 text-[14px]">Instructor</p>
          </Typography>
          
        </Box>
      </FlexBetween>
      
    </FlexBetween>
  );
};

export default Friend;