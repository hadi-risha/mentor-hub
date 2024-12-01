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
            {/* Routes for Student */}
            {userRole === "student" ? (
              <>
                {/* <Route path="/student/modal" element={<ProtectedRoute><UserModal /></ProtectedRoute>} />  */}
                <Route path="/student/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} /> 
                <Route path="/student/sessions" element={<ProtectedRoute><StudentAllSessions /></ProtectedRoute>} /> 

                
                <Route path="/student/instructors" element={<ProtectedRoute><ViewInstructors /></ProtectedRoute>} /> 

                <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
                <Route path="/student/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

                <Route path="/student/session/:id" element={<ProtectedRoute><SingleSessionInfo /></ProtectedRoute>} />
                <Route path="/student/book-session/:sessionId" element={<ProtectedRoute><StudentBookSession /></ProtectedRoute>} />  
                <Route path="/student/session-payment/:sessionId" element={<ProtectedRoute><SessionPayment /></ProtectedRoute>} />    

                <Route path="/student/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />  
                <Route path="/student/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />   

                <Route path="/student/upcoming-sessions" element={<ProtectedRoute><UpcomingSessions /></ProtectedRoute>} />   
                <Route path="/student/reserved-session/:id" element={<ProtectedRoute><ReservedSessionInfo /></ProtectedRoute>} /> 


                <Route path="*" element={<Navigate to="/student/home" replace />} />
              </>

            ) : userRole === "instructor" ? (
              // Routes for Instructor
              <>

                {/*   /**************** testing components *****************   */}
                <Route path="/instructor/home" element={<ProtectedRoute><InstructornewHome /></ProtectedRoute>} /> 
                <Route path="/instructor/profile" element={<ProtectedRoute><NewProfile /></ProtectedRoute>} />
                <Route path="/instructor/update-profile" element={<ProtectedRoute><InstructorUpdateProfile /></ProtectedRoute>} />
                <Route path="/instructor/create-session" element={<ProtectedRoute><NewCreateSession /></ProtectedRoute>} />  
                <Route path="/instructor/session/:id" element={<ProtectedRoute><ISingleSessionDetails /></ProtectedRoute>} /> {/* single session info */}
                <Route path="/instructor/update-session/:sessionId" element={<ProtectedRoute><UpdateSession /></ProtectedRoute>} />  
                <Route path="/instructor/session-actions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />  {/* get instructor all available sessions for delete& update */}
                <Route path="/instructor/all-sessions" element={<ProtectedRoute><AllSessions /></ProtectedRoute>} />  {/* get instructor all available sessions for delete& update */}





                <Route path="/instructor/booked-sessions" element={<ProtectedRoute><BookedSessions /></ProtectedRoute>} /> 









                {/*   /**************** /testing components *****************   */}









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
                {console.error("error in user routes")}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
              
              
        </div>
    </>
  );
}

export default UserRoutes;
