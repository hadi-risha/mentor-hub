// on track

import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import ChatList from "../../components/user/ai/chatList/ChatList";

const DashboardLayout = () => {

  return (
    <div className="w-full bg-[#0e0c16] flex gap-3 pt-5 h-full dashboardLayout">
      <div className="w-1/4">
        <ChatList />
      </div>
      <div className="flex-1 bg-[#12101b]">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
