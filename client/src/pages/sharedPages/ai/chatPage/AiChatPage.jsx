// on track

import "./chatPage.css";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useEffect, useRef } from "react";
import NewPrompt from "../../../../components/user/ai/newPrompt/NewPrompt";
import axiosInstance from "../../../../utils/users/axiosInstance";


const AiChatPage = () => {
  const userRole = localStorage.getItem("userRole");

  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  console.log("chatId in chatpage---------------------------------;;;", chatId);
  

  console.log("in chat page----------------1");

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      try {
        console.log("in chat page----------------2");
        const response = await axiosInstance.get(`/${userRole}/ai/chat/${chatId}`);
        console.log("response----------------", response);
        console.log("response.data.chat in chatpage---------------", response.data.chat);

        return response.data.chat; // return the data from the response
      } catch (err) {
        console.log("error in chatpage :- ", err);
        throw new Error(err.message || "Failed to fetch data");
      }
    },
  });

  console.log("data--------------333", data);

  return (
    <div className="text-white chatPage">
      <div className="wrapper">
        <div className="chat">
          {/* <div className="message">Test message from ai</div>
          <div className="message user">Test message</div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message</div> */}

          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <>
                  {message.img && (
                    <IKImage
                      // urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      urlEndpoint="https://ik.imagekit.io/cfss1m3oa"
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                    key={i}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
