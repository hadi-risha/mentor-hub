
import { useEffect, useState } from "react";
import {FlatColorIconsGoogle, MdiEye, MdiEyeOff}  from "../../assets/usersIcons/LoginIcons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import { loginUser } from '../../slices/loginSlice';  // Import the login action
import { useNavigate } from "react-router-dom";
import LoginErrorModal from '../../utils/users/LoginErrorModal';
import VerifyEmailModal from '../../utils/users/VerifyEmailModal';
import config from '../../config';
import axios from "axios";
import { setUserRole } from '../../slices/userRoleSlice';
import UserRoutes from "../../routes/UserRoutes";


//

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const loginState = useSelector((state: RootState) => state.login);  // Select login state

  // const userRole = useSelector((state: RootState) => state.userRole);
  const userRole = useAppSelector((state) => state.userRole.role);

  const [emailError, setEmailError] = useState("");   // Field-specific error
  const [passwordError, setPasswordError] = useState(""); // Field-specific error
  const [commonError, setCommonError] = useState("");   // General error
  const [verifyemailError, setVerifyemailError] = useState("")
  // const [verifyEmail, setVerifyEmail] = useState("");   // verify email error

  const [isModalOpen, setModalOpen] = useState(false);
  // const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);


  // const [authToken, setAuthToken] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState('');

  useEffect(() => {
    
    
    console.log("1");
    console.log("userRole from store----------------------------1", userRole);
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const role = urlParams.get("role");
    let data = urlParams.get("userData");


    



    console.log("token--------------------", token );
    console.log("data--------------------", data );
    console.log("role--------------------", role );

    console.log("2");
        if (token && role) {
          dispatch(setUserRole(role)); // Dispatch action to store the role in Redux

          localStorage.setItem("userRole", role);

          console.log("userRole from store after seting store role value 2", userRole);
        

          setAuthToken(token);
          localStorage.setItem("token", token); // Store token in localStorage for persistence
          window.location.reload();

        }
    
        

        console.log("from login page , navigate to --> ", role ,"/home");
        console.log("3");
        
        console.log("role url",`/${role}/home`);
        
        // navigate(`/${role}/home`);

        


        console.log("......");
        console.log("......");
    }, [dispatch]);


  //   useEffect(() => {
  //     // Access and log the user role after it has been set
  //     console.log("userRole from store after setting role:::::::::::::::", userRole);
  // }, [userRole]);



    // useEffect(() => {
    //   console.log("userRole from store after seting store role value,     2nd ueff", userRole);
    //   console.log("comeees 2nd useeffect");
      
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     console.log("if case    7");
        
    //     // Redirect to home page or refresh
    //     console.log("Token found, redirecting or refreshing...");
    //     console.log("user role  00", userRole);
        
    //     // You can either redirect to home page or refresh
    //     // navigate('/'); // Replace '/home' with your desired route
    //     // window.location.reload();
    //   }
    // }, []);

  


  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error states
    setEmailError("");
    setPasswordError("");
    setCommonError("");

    // Simple validation
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("result in login pagee", result);
      
      if (result.role) {

        console.log("in result.role", result.role);
        
        localStorage.setItem("userRole", result.role);


        navigate(`/${result.role}/home`);
        // navigate(result.homePageUrl);  // Redirect to the specified homepage URL
      }               

      
    } catch (err: any) {

      console.log("login page catch block222222222222222222");
      
      console.log("show all errors",err);
      console.log("needsverification",err?.needsVerification);
      console.log("message",err.message);

      if (err?.needsVerification) {
        console.log("needsVerification 1, if block");

        setVerifyemailError(err.message);
        setShowVerifyModal(true);
      } else {

        console.log("err mmmmmmm2, else block", err);
        console.log("come in this section");

        const message = err?.message || "An error occurred during login";
        setCommonError(message);
        setModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Function to close the modal
    setCommonError(''); // Clear the error message
  };


  const closeVerifyModal = () => {
    setShowVerifyModal(false); // Function to close the modal
    setVerifyemailError(''); // Clear the error message
  };

  const onCancel= () => {
    // Handle cancel scenario here
    console.log("Verification cancelled");
    setShowVerifyModal(false); // Close the modal
    // Optionally, reset login state or perform other actions
  }


  // Clear email error on focus
  const handleEmailFocus = () => {
    setEmailError("");
  };

  // Clear password error on focus
  const handlePasswordFocus = () => {
    setPasswordError("");
  };

  // const loginwithgoogle = ()=>{
    // window.open("http://localhost:3001/api/auth/google/callback","_self");
    // window.open(`${config.googleAuthCallback}`,"_self");
  // }

  const loginwithgoogle = ()=>{
    // window.open("http://localhost:3001/api/auth/google/callback","_self");
    // window.open(`${config.googleAuthCallback}`,"_self");

    try {
      // Open Google auth in a new window

      console.log("in loginwithgoogle section...........000000000000");
      
      window.open(`${config.googleAuthCallback}`, "_self");
    } catch (error) {
      console.log("in loginwithgoogle errorrr...........");
      console.error("Error during Google login:", error);
    }
  }

  
  
  return (
    
    <div className="h-screen bg-gray-100">
      {/* <UserRoutes token={authToken} userRole={userRole} /> */}

        <h1 className="text-center py-14 text-black text-2xl font-bold">Sign in</h1>
        
        <div className="rounded-xl flex -mt-6 ml-96 signup-container shadow-2xl shadow-slate-400 bg-white w-2/4 h-4/6 justify-center items-center">

          {/* right side */}
          <div className="w-1/2 h-full rounded-tl-xl rounded-bl-xl bg-login-custom-gradient items-center justify-center">
            <h1 className="text-3xl font-bold text-white ml-28 mt-36">Welcome!</h1>
            <p className="text-white text-sm w-80 text-center ml-8 mt-4">Unlock your potential—let's dive into learning together!</p>

            <a href="/signup">
              <button className="ml-28 mt-10 rounded-full border-2 border-white text-white px-11 py-2 text-xs font-bold">SIGN UP</button>
            </a>
          </div>

          {/* left side */}
          <div className="w-1/2 h-full rounded-tr-xl  rounded-br-xl ">
            <h1 className="text-black font-bold font-sans text-3xl mt-11 ml-32">Sign in</h1>

            <form onSubmit={handleSubmit}>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  className=" ml-11 mt-11 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                  placeholder="Email"
                />
                {emailError && <p className="text-red-500 text-xs ml-12 mt-1">{emailError}</p>}  {/* Display email error */}

              
              <div className="flex items-center ml-11 mt-3 w-72 pr-2 bg-gray-100 text-sm text-black focus:outline-none placeholder-gray-500 placeholder:text-xs">
                {/* Password Input */}
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handlePasswordFocus} 
                  className="w-full p-2 text-sm bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                  placeholder="Password"
                />

                {/* pswrd visibility button */}
                <button
                  type="button"  
                  onClick={togglePasswordVisibility}
                  className="ml-2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <MdiEye className="w-4 h-4" /> : <MdiEyeOff className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs ml-12 mt-1">{passwordError}</p>}  {/* Display password error */}
              {/* {commonError && <p className="text-red-500 text-xs ml-11 mt-1">{commonError}</p>}   */}

              <LoginErrorModal
                message={commonError}
                isOpen={isModalOpen}
                onClose={closeModal}
              />

        
            <VerifyEmailModal 
              message={verifyemailError} 
              isOpen={showVerifyModal}
              email={email}    // Pass email if needed for display
              onClose={closeVerifyModal}
              onCancel={onCancel}
            />

    
              <a href="/forgot-password">
                <p className="ml-32 mt-6 font-medium text-gray-600 text-xs">Forgot your password?</p>
              </a>
              <button className="ml-32 mt-6 rounded-full bg-primary-orange border-2 border-primary-orange text-white px-11 py-2 text-xs font-bold">SIGN IN</button>
            </form>

            <div className="mt-9 flex items-center justify-center space-x-4">
              <hr className="w-32 border-gray-300" />
              <span className="text-black ">or</span>
              <hr className="w-28 border-gray-300" />
            </div>

            <div className="mt-10 ml-12 w-72 flex items-center rounded-full border-2 border-gray-300 px-3 py-2 w-94 h-7 ">
              <FlatColorIconsGoogle className="ml-16" />
              {/* <a href="/google-auth"> */}
                <button className="-ml-9  text-black px-11 py-2 text-xs" onClick={loginwithgoogle}>
                  Sign in with Google
                </button>
              {/* </a> */}
            </div>
          
          </div>
        </div>
    </div>
    
  );
};
  
  export default Login;

  
