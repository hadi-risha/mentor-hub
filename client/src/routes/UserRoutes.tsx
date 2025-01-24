import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/user/UserHeader";
import SideNavBar from "../components/user/UserNavbar";
// import StudentHome from "../pages/student/Home";
import InstructorHome from "../pages/instructor/Home";
import InstructorProfile from "../pages/instructor/Profile";
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import StudentUpdateProfile from "../pages/student/StdUpdateProfile";
import InstructorUpdateProfile from "../pages/instructor/UpdateProfile";
import ISingleSessionDetails from "../pages/instructor/SingleSessionDetails";
// import SingleSessionDetails from "../pages/student/SingleSessionData";
import SessionPayment from "../pages/student/SessionPayment";
import CreateSession from "../pages/instructor/CreateSession";
import UpdateSession from "../pages/instructor/UpdateSession";
import PaymentCancel from "../pages/student/PaymentCancel";
import BookedSessions from "../pages/instructor/BookedSessions";
import Sessions from "../pages/instructor/Sessions";
import UserModal from "../components/user/Modal";
import InstructornewHome from "../pages/instructor/InstructorHome";
import ViewInstructors from "../pages/student/ViewInstructors";
import NewSingleSessionInfo from "../pages/student/StdSingleSessionInfo";
import StudentHome from "../pages/student/StdHome";
import StudentProfile from "../pages/student/stdProfile";
import UpdateProfile from "../pages/student/StdUpdateProfile";
import UpcomingSessions from "../pages/student/StdUpcomingSessions";
import SingleSessionInfo from "../pages/student/StdSingleSessionInfo";
import PaymentSuccess from "../pages/student/StdPaymentSuccess";
import StudentBookSession from "../pages/student/StdBookSession";
import AllSessions from "../pages/instructor/AllSessions";
import StudentAllSessions from "../pages/student/AllSessions";

import ReservedSessionInfo from "../pages/student/ReservedSessionInfo";
import NewProfile from "../pages/instructor/NewProfile";
import NewCreateSession from "../pages/instructor/NewCreateSession";
import SessionHistory from "../pages/student/SessionHistory";
import InstructorSessionHistory from "../pages/instructor/SessionHistory";
import StdMeetingRoom from "../pages/student/MeetingRoom";
import MeetingRoomPage from "../pages/sharedPages/MeetingRoom";
import Notifications from "../pages/sharedPages/Notification";
import StudentChat from "../pages/student/studentChat";
import CreatePost from "../pages/instructor/createPost";
import AllPosts from "../pages/instructor/AllPosts";
import RecentSessions from "../pages/student/RecentSessions";
import Wallet from "../pages/instructor/Wallet";
import AiHomepage from "../pages/sharedPages/ai/homepage/AiHomepage";
import AiDashboardPage from "../pages/sharedPages/ai/dashboardPage/AiDashboardPage";
import AiChatPage from "../pages/sharedPages/ai/chatPage/AiChatPage";
import DashboardLayout from "../aiLayouts/dashboardLayout/DashboardLayout";
import ChangePassword from "../pages/sharedPages/ChangePassword";
import PostsWidget from "../pages/sharedPages/PostsWidget.jsx";
import CancelledSessionInfo from "../pages/student/CancelledSessionInfo";
import Wishlist from "../pages/student/Wishlist";


interface UserRoutesProps {
  token: string | null;
  userRole: string | null; // Include userRole in props
}

function UserRoutes({ token, userRole }: UserRoutesProps) {

  console.log("token ", token);

  if(userRole === null){
    userRole = localStorage.getItem("userRole")
  }
  console.log("userRole in routesss", userRole);
  if (!token || !userRole) {
    console.log("!token");
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
        <div className="flex h-screen">
          {/* <SideNavBar /> */}

          <Routes>
            {/* Shared Routes for all authenticated users */}
            <Route path="/user/meeting-room/:meetingRoomId" element={<MeetingRoomPage />} /> 
            <Route path="/user/notifications" element={<Notifications />} /> 
            <Route path="/user/chat" element={<StudentChat />} /> 
            {/* <Route path="/user/posts" element={<AllPosts />} />  */}

            <Route path="/user/ai/home" element={<AiHomepage />} /> 
            {/* <Route path="/user/ai/dashboard" element={<AiDashboardPage />} /> 
            <Route path="/user/ai/dashboard/chats/:id" element={<AiChatPage />} /> */}
            <Route path="/user/ai" element={<DashboardLayout />}>
              <Route path="/user/ai/dashboard" element={<AiDashboardPage />} />
              <Route path="/user/ai/dashboard/chats/:id" element={<AiChatPage />} />
            </Route>

            <Route path="/user/reset-password" element={<ChangePassword />} /> 


            <Route path="/user/posts" element={<PostsWidget />} /> 



          

            {/* Routes for Student */}
            {userRole === "student" ? (
              <>
                {/* <Route path="/student/modal" element={<ProtectedRoute><UserModal /></ProtectedRoute>} />  */}
                <Route path="/student/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} /> 
                <Route path="/student/sessions" element={<ProtectedRoute><StudentAllSessions /></ProtectedRoute>} /> 
                <Route path="/student/session/:id" element={<ProtectedRoute><SingleSessionInfo /></ProtectedRoute>} />


                <Route path="/student/instructors" element={<ProtectedRoute><ViewInstructors /></ProtectedRoute>} /> 

                <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
                <Route path="/student/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

                <Route path="/student/book-session/:sessionId" element={<ProtectedRoute><StudentBookSession /></ProtectedRoute>} />  
                <Route path="/student/session-payment/:sessionId" element={<ProtectedRoute><SessionPayment /></ProtectedRoute>} />    

                <Route path="/student/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />  
                <Route path="/student/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />   

                <Route path="/student/upcoming-sessions" element={<ProtectedRoute><UpcomingSessions /></ProtectedRoute>} />   
                <Route path="/student/reserved-session/:id" element={<ProtectedRoute><ReservedSessionInfo /></ProtectedRoute>} /> 

                <Route path="/student/cancelled-session/:id" element={<ProtectedRoute><CancelledSessionInfo /></ProtectedRoute>} /> 


                <Route path="/student/session-history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} /> 


                <Route path="/student/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />  

                <Route path="/student/recent-sessions" element={<ProtectedRoute><RecentSessions /></ProtectedRoute>} /> 

                <Route path="/student/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} /> 


                <Route path="*" element={<Navigate to="/student/home" replace />} />
              </>

            ) : userRole === "instructor" ? (
              // Routes for Instructor
              <>

                <Route path="/instructor/home" element={<ProtectedRoute><InstructornewHome /></ProtectedRoute>} /> 
                <Route path="/instructor/profile" element={<ProtectedRoute><NewProfile /></ProtectedRoute>} />
                <Route path="/instructor/update-profile" element={<ProtectedRoute><InstructorUpdateProfile /></ProtectedRoute>} />
                <Route path="/instructor/create-session" element={<ProtectedRoute><NewCreateSession /></ProtectedRoute>} />  
                <Route path="/instructor/session/:id" element={<ProtectedRoute><ISingleSessionDetails /></ProtectedRoute>} /> {/* single session info */}
                <Route path="/instructor/update-session/:sessionId" element={<ProtectedRoute><UpdateSession /></ProtectedRoute>} />  
                <Route path="/instructor/session-actions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />  {/* get instructor all available sessions for delete& update */}
                <Route path="/instructor/all-sessions" element={<ProtectedRoute><AllSessions /></ProtectedRoute>} />  {/* get instructor all available sessions for delete& update */}
                <Route path="/instructor/booked-sessions" element={<ProtectedRoute><BookedSessions /></ProtectedRoute>} /> 
                <Route path="/instructor/session-history" element={<ProtectedRoute><InstructorSessionHistory /></ProtectedRoute>} /> 




                <Route path="/instructor/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />  

                  <Route path="/instructor/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />  


                {/* <Route path="/instructor/all-posts" element={<ProtectedRoute><AllPosts /></ProtectedRoute>} />  get instructor all available sessions for delete& update */}








                {/* <Route path="/instructor/meeting-dashboard" element={<ProtectedRoute><MeetingDashboard /></ProtectedRoute>} />  */}
                {/* <Route path="/instructor/meeting-room/:meetingRoomId" element={<ProtectedRoute><InstructorMeetingRoom /></ProtectedRoute>} />  */}
                {/* <Route path="/instructor/home" element={<ProtectedRoute><InstructorHome /></ProtectedRoute>} /> */}
                {/* <Route path="/instructor/profile" element={<ProtectedRoute><InstructorProfile /></ProtectedRoute>} /> */}
                {/* <Route path="/instructor/update-profile" element={<ProtectedRoute><InstructorUpdateProfile /></ProtectedRoute>} /> */}
                {/* <Route path="/instructor/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />   */}
                {/* <Route path="/instructor/update-session/:id" element={<ProtectedRoute><UpdateSession /></ProtectedRoute>} />   */}
                {/* <Route path="/instructor/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />  get instructor all available sessions */}
                {/* <Route path="/instructor/booked-sessions" element={<ProtectedRoute><BookedSessions /></ProtectedRoute>} />  */}
                

                <Route path="*" element={<Navigate to="/instructor/home" replace />} />
              </>
            ) : (
              
              <>
                {/* {console.error("error in user routes")} */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </div>
    </>
  );
}

export default UserRoutes;
