// on track

import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../utils/users/axiosInstance";

const ChatList = () => {
    const userRole = localStorage.getItem("userRole");


  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    // queryFn: () => fetch(`/${userRole}/ai/chat`).then((res) => res.json()),
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/${userRole}/ai/userchats`);
        // console.log("response in chatlist", response);
        // console.log("response.data.userChats in chatlist", response.data.userChats);

        return response.data.userChats; // return the data from the response
      } catch (err) {
        console.log("error in chatlist :- ", err);

        throw new Error(err.message || "Failed to fetch data");
      }
    },
  });

  return (
    <div className="pl-10 pr-4 h-[650px] text-white flex flex-col chatList">
      {" "}
      <span className="font-semibold text-xs mb-2.5 title">DASHBOARD</span>{" "}
      <Link to="/user/ai/dashboard">Create a new Chat</Link>{" "}
      <Link to="/">Explore Connect AI</Link>
      <Link to="/">Contact</Link>
      <hr className="border-0 h-0.5 bg-gray-300 opacity-10 rounded-lg my-5" />
      <span className="font-semibold text-xs mb-2.5 title">
        RECENT CHATS
      </span>{" "}
      <div className="list">
        {" "}
        {/* <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link> */}
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/user/ai/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>{" "}
    </div>
  ); 
};

export default ChatList;
