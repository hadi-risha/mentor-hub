// on track

import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import arrow from '../../../../assets/userImgs/arrow.png'
import chat from "../../../../assets/userImgs/chat.png";
import analyzeImg from "../../../../assets/userImgs/analyzeImg.png";
import code from "../../../../assets/userImgs/code.png";
import axiosInstance from "../../../../utils/users/axiosInstance";

const AiDashboardPage = () => {
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem("userRole");
  //  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {
      try {
        const response = await axiosInstance.post(`/${userRole}/ai/chat`, {
          text,
        });
        console.log("response.data in ai dashboard page------", response.data);
        console.log(
          "response in ai dashboard page------0080",
          response.data.newChatId
        );
        return response.data.newChatId;
      } catch (error) {
        console.log("error in newPrompt :- ", error);
      }
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });

      console.log("id in dashboard------------------0000", id);

      navigate(`/user/ai/dashboard/chats/${id}`);
    },
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    console.log("text in newPrompt----------------", text);

    mutation.mutate(text);
  }; 


  return (
    //
    <div className="h-[670px] flex flex-col items-center dashboardPage">
      <div className="flex-1 flex flex-col items-center justify-center w-1/2 gap-12 texts">
      {/* <div className=" w-1/2 h-96 flex flex-col items-center justify-center gap-12 texts"> */}
        <div className="-mt-20 flex items-center gap-5 opacity-20 logo">
          <img src="/logo.png" alt="" className="w-12 h-12" />
          <h1
            className="text-4xl font-bold"
            style={{
              background: "linear-gradient(to right, #217bfe, #e55571)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text", // For Safari support
              color: "transparent",
            }}
          >
            CONNECT AI
          </h1>
        </div>

        <div className="w-full text-white flex items-center justify-between gap-12 options">
          <div className="flex-1 flex flex-col gap-2.5 font-light text-sm p-5 border border-[#555] rounded-2xl option">
            <img src={chat} alt="" className="w-10 h-10 object-cover" />
            <span>Create a New Chat</span>
          </div>
          <div className="flex-1 flex flex-col gap-2.5 font-light text-sm p-5 border border-[#555] rounded-2xl option">
            <img src={analyzeImg} alt="" className="w-10 h-10 object-cover" />
            <span>Analyze Images</span>
          </div>
          <div className="flex-1 flex flex-col gap-2.5 font-light text-sm p-5 border border-[#555] rounded-2xl option">
            <img src={code} alt="" className="w-10 h-10 object-cover" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-auto w-1/2 bg-[#2c2937] rounded-2xl flex formContainer">
        <form
          onSubmit={handleSubmit}
          className="p-3 w-full h-full flex items-center justify-between "
        >
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="flex-1 p-2 bg-[#2c2937] border-0 outline-none text-[#ececec] placeholder:text-[#6f6f6f] placeholder:text-sm"
          />
          <button className="p-2.5 mr-5 w-9 h-9 bg-[#605e68] rounded-full cursor-pointer flex items-center justify-center">
            <span className="text-[#2c2937] text-xl transform -rotate-90">
              ➔
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiDashboardPage;
