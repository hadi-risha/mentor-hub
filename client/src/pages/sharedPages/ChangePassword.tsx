
import blueBgLogo from '../../assets/userImgs/gradientLogo.png'
import { MdiEye, MdiEyeOff}  from "../../assets/usersIcons/LoginIcons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import  {resetUserPassword}  from '../../slices/resetPasswordSlice';
import CommonSuccessModal from '../../utils/users/commonSuccessModal';
import axiosInstance from '../../utils/users/axiosInstance';



const ChangePassword = () => {

    const location = useLocation(); // Get token from URL params
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userRole = localStorage.getItem("userRole");

    // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (!trimmedPassword || !trimmedConfirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          return;
        }

        try {
          const response = await axiosInstance.put(`/${userRole}/change-password`, {
            password: trimmedPassword,
            confirmPassword: trimmedConfirmPassword,
          });

          console.log("res data in rset pass data------------",response.data);
          console.log("res data in rset pass------------",response.data.status);
    
          if (response?.data?.message === "Password changed successfully") {
              setSuccess('Password reset successful!');
              setError('');
              alert('Password reset successful!');
              navigate(`/${userRole}/profile`); 
          } else {
              setError('Something went wrong. Please try again.');
              console.log("Something went wrong. Please try again.");
          }
        } catch (error) {
          setError('Failed to reset password.');
          console.error("Error fetching notifications:", error);
        }
    };

    // Clear password error on focus
    const handlePasswordFocus = () => {
      setError("");
    };
  
  return (
        <div className="h-screen w-full bg-gray-100 flex justify-center">

            
              <div className="mt-20 rounded-xl signup-container shadow-2xl shadow-slate-400 bg-white w-3/12 h-3/6 justify-center items-center">
                

                <div className='mt-10 flex items-center space-x-14'>
                  <Link to={`/${userRole}/profile`}>
                      <div className='ml-6 border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                          <span className="text-black text-xl">←</span>
                      </div>
                  </Link>
  
                   <div className='text-black'> 
                      <h1 className="text-black font-bold text-xl">Reset Password</h1>
                  </div> 
                </div> 

                <form onSubmit={handleSubmit}>
                  <div className="flex items-center ml-11 mt-16 w-72 pr-2 bg-gray-100 text-sm text-black focus:outline-none placeholder-gray-500 placeholder:text-xs">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handlePasswordFocus} 
                      className="w-full p-2 text-sm bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                      placeholder="New password"
                    />

                    <button
                      type="button"  
                      onClick={togglePasswordVisibility}
                      className="ml-2 text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <MdiEye className="w-4 h-4" /> : <MdiEyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="ml-11 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                    placeholder="Confirm password"
                  />
                  

                  {error && <p className="text-red-500 text-xs ml-12 mt-1">{error}</p>}
                  {success && <p className="text-green-500 text-xs ml-12 mt-1">{success}</p>}
                
                  <button className="block ml-36 mt-10 w-20 rounded-lg bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-2 border-blue-50 text-white px-2 py-2 text-xs font-medium">
                      Submit
                  </button>
                </form>
              </div>
            
        </div>
    );
};
  
  export default ChangePassword;

  
