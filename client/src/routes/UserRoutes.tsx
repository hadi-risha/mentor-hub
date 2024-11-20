import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/user/UserHeader";
import SideNavBar from "../components/user/UserNavbar";
import StudentHome from "../pages/student/Home";
import StudentProfile from "../pages/student/Profile";
import InstructorHome from "../pages/instructor/Home";
import InstructorProfile from "../pages/instructor/Profile";
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import StudentUpdateProfile from "../pages/student/UpdateProfile";
import InstructorUpdateProfile from "../pages/instructor/UpdateProfile";
import ISingleSessionDetails from "../pages/instructor/SingleSessionDetails";
// import SingleSessionDetails from "../pages/student/SingleSessionData";
import StudentBookSession from "../pages/student/BookSession";
import SessionPayment from "../pages/student/SessionPayment";
import UpcomingSessions from "../pages/student/UpcomingSessions";
import CreateSession from "../pages/instructor/CreateSession";
import UpdateSession from "../pages/instructor/UpdateSession";
import SingleSessionInfo from "../pages/student/SingleSessionInfo";
import PaymentSuccess from "../pages/student/PaymnetSuccess";
import PaymentCancel from "../pages/student/PaymentCancel";
import BookedSessions from "../pages/instructor/BookedSessions";
import Sessions from "../pages/instructor/Sessions";


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
          <SideNavBar />
            
          <Routes>
            {/* Routes for Student */}
            {userRole === "student" ? (
              <>
                <Route path="/student/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} />

                <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
                <Route path="/student/update-profile" element={<ProtectedRoute><StudentUpdateProfile /></ProtectedRoute>} />

                <Route path="/student/session/:id" element={<ProtectedRoute><SingleSessionInfo /></ProtectedRoute>} />

                <Route path="/student/book-session/:sessionId" element={<ProtectedRoute><StudentBookSession /></ProtectedRoute>} />  {/* move to student  */}
                {/* session payment */}
                <Route path="/student/session-payment/:sessionId" element={<ProtectedRoute><SessionPayment /></ProtectedRoute>} />    {/* move to student  */}

                <Route path="/student/payment-succes" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />    {/* move to student  */}
                <Route path="/student/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />    {/* move to student  */}


                <Route path="/student/upcoming-sessions" element={<ProtectedRoute><UpcomingSessions /></ProtectedRoute>} />    {/* move to student  */}

                

                <Route path="*" element={<Navigate to="/student/home" replace />} />
              </>
            ) : userRole === "instructor" ? (
              // Routes for Instructor
              <>
                <Route path="/instructor/home" element={<ProtectedRoute><InstructorHome /></ProtectedRoute>} />
                <Route path="/instructor/profile" element={<ProtectedRoute><InstructorProfile /></ProtectedRoute>} />
                <Route path="/instructor/update-profile" element={<ProtectedRoute><InstructorUpdateProfile /></ProtectedRoute>} />
                <Route path="/instructor/session/:id" element={<ProtectedRoute><ISingleSessionDetails /></ProtectedRoute>} />
                <Route path="/instructor/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />  
                <Route path="/instructor/update-session/:sessionId" element={<ProtectedRoute><UpdateSession /></ProtectedRoute>} />  
                {/* <Route path="/instructor/update-session/:id" element={<ProtectedRoute><UpdateSession /></ProtectedRoute>} />   */}


                {/* <Route path="/instructor/book-session" element={<ProtectedRoute><StudentBookSession /></ProtectedRoute>} />  move to student  */}
                {/* <Route path="/instructor/session-payment" element={<ProtectedRoute><SessionPayment /></ProtectedRoute>} />    move to student  */}
                <Route path="/instructor/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />  {/* get instructor all available sessions */}
                <Route path="/instructor/booked-sessions" element={<ProtectedRoute><BookedSessions /></ProtectedRoute>} /> 
                



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
