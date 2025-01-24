import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
   Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "./FlexBetween.jsx";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper.jsx";
import { useState } from "react";

import { ChatState } from "../../chatContext/ChatProvider.js";  //-------------------------
import axiosInstance from "../../utils/users/axiosInstance.ts";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const { posts, setPosts } = ChatState();
  const [isComments, setIsComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem("userRole");
  // const dispatch = useDispatch();
  // const token = useSelector((state) => state.token);
  // const loggedInUserId = useSelector((state) => state.user._id);
  const id = localStorage.getItem("userId");

  // Check if the post is liked by the user
  const isLiked = Boolean(likes[id]);


  // its map and type is boolean - eg :- likes = {
  //                                               "fyghiukhiu" : true,
  //                                               "bgfythvjhh" : true,
  //                                              }
  // if user liked then the obj(map) will return true, else thats will give false
  const likeCount = Object?.keys(likes)?.length;

  const { palette } = useTheme();
  const main = palette?.neutral?.main;
  const primary = palette?.primary?.main;

  const patchLike = async () => {
    // Optimistically update the UI: toggle the like state locally
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: {
                ...post.likes,
                [id]: !isLiked, // Toggle the like state for the current user
              },
            }
          : post
      )
    );

    try {
      const response = await axiosInstance.patch(
        `/${userRole}/post/${postId}/like`
      );
      console.log("Response data:", response.data);

      const updatedPost = response?.data?.updatedPost || [];
      console.log("patch likes Parsed posts:", updatedPost);

      // Sync with the backend once the like/dislike action is done
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );

      // setPosts((prevPosts) => [...prevPosts, updatedPost]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setLoading(false);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          className="w-full h-[380px]"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}

      <Box display="flex" justifyContent="space-between" mt="0.25rem">
        <Box display="flex" gap="1rem">
          {/* Like Button with Count */}
          <Box display="flex" gap="0.3rem" alignItems="center">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            {likeCount > 0 && <Typography>{likeCount}</Typography>}
          </Box>

          {/* Comment Button with Count */}
          <Box display="flex" gap="0.3rem" alignItems="center">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {comments?.length > 0 && <Typography>{comments.length}</Typography>}
          </Box>
        </Box>

        {/* Share Button */}
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </Box>

      {isComments && (
        <Box mt="0.5rem">
          {comments?.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography
                sx={{
                  color: main,
                  m: "0.5rem 0",
                  pl: "1rem",
                }}
              >
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;