import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "state";
// import PostWidget from "./PostWidget";
import { ChatState } from "../../chatContext/ChatProvider.js";  //-------------------------
import axiosInstance from "../../utils/users/axiosInstance.ts";
import PostWidget from "./PostWidget.jsx";

import { Box, useMediaQuery } from "@mui/material";




const PostsWidget = ({ }) => {
  const { posts, setPosts } = ChatState();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const userRole = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(false)

  // const dispatch = useDispatch();
  // const posts = useSelector((state) => state.posts);
  // const token = useSelector((state) => state.token);

   useEffect(() => {
     async function fetchPosts() {
       try {
         const response = await axiosInstance.get(`/${userRole}/posts`);
         console.log("Response data:", response.data);

         const posts = response?.data?.posts || [];

         if (!Array.isArray(posts)) {
           console.error("Unexpected posts format:", response?.data);
           setLoading(false);
           return;
         }

         console.log("Parsed posts:", posts);
         setPosts(posts); // Update state with session data
         setLoading(false);
       } catch (error) {
         console.error("Failed to fetch posts:", error);
         setLoading(false);
       }
     }

     fetchPosts();
   }, []);

  
  return (
    <>
      <div className="h-auto flex justify-center">
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          className="w-5/12"
          
          // display="flex" // Use flexbox to arrange items
          // justifyContent="center" // Center items on the X-axis
          // flexWrap="wrap" // Allow items to wrap if there's not enough space
          // gap={2}
        >
          {posts?.map((post) => {
            // Destructuring the properties from the post and instructorId
            const { _id, instructorId, description, image, likes, comments } =
              post;
            console.log(
              "_id, instructorId, description, image, likes, comments",
              _id,
              instructorId,
              description,
              image,
              likes,
              comments
            );

            // Destructuring user details from instructorId
            const { firstName, lastName } = instructorId;
            console.log("firstName, lastName", firstName, lastName);

            console.log("session image--hjhj", image?.url);

            return (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={instructorId?._id} // Assuming instructorId has an _id
                name={`${firstName} ${lastName}`} // Full name from first and last name
                description={description}
                picturePath={image?.url} // Assuming image is an object with a url property
                userPicturePath={instructorId?.image.url}
                likes={likes}
                comments={comments}
              />
            );
          })}
        </Box>
      </div>
    </>
  );
};

export default PostsWidget;