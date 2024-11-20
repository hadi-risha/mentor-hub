
import blueBgLogo from '../../assets/userImgs/gradientLogo.png'
import { MdiEye, MdiEyeOff}  from "../../assets/usersIcons/LoginIcons";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import  {resetUserPassword}  from '../../slices/resetPasswordSlice';
import CommonSuccessModal from '../../utils/users/commonSuccessModal';


const ResetPassword = () => {
    const location = useLocation(); // Get token from URL params
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    // Extract token from query string
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    console.log("tokennnn........", token);
    

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
          if (!token) {
            setError('Invalid or missing reset token.');
            return;
          }
          console.log('Submitting reset password with: frontend.......', { token, password, confirmPassword });
          let result = await dispatch(resetUserPassword({ token, password, confirmPassword })); // Dispatch password reset action

          console.log("result1111111111111111", result);

          if (result) {
            // Success handling
            console.log("Password reset successful", result);
            setSuccess('Password reset successful!');
            setError('');
            setIsModalOpen(true);

            // Redirect after showing success modal
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
          
         
        } catch (error) {
          

          setError('Failed to reset password.'); // You might want to log the actual error here
          return; 
        }
    };

     // Clear password error on focus
  const handlePasswordFocus = () => {
    setError("");
  };
  
  return (
        <div className="h-screen bg-gray-100">

            <h1 className="text-center py-16  text-black text-2xl font-bold">
                {/* Otp Verification */}
            </h1>
            <div className="rounded-xl flex -mt-6 ml-96 signup-container shadow-2xl shadow-slate-400 bg-white w-2/4 h-4/6 justify-center items-center">

            {/* right side */}
            <div className="w-1/2 h-full rounded-tl-xl rounded-bl-xl bg-verification-custom-gradient items-center justify-center">
                <img src={blueBgLogo} alt="My Local" className="ml-36 mt-24 h-24 w-24 rounded-full" />
                <h1 className="text-2xl font-bold text-white ml-16 mt-5">Set a New Password!</h1>
                <p className="text-white text-sm w-80 text-center ml-8 mt-4">Unlock your potential—let's dive into learning together!</p>

            </div>

            {/* left side */}
            <div className="w-1/2 h-full rounded-tr-xl  rounded-br-xl ">
                <h1 className="text-black font-bold text-xl mt-28 ml-24">Change Password</h1>
                
                <form onSubmit={handleSubmit}>

                  <div className="flex items-center ml-11 mt-16 w-72 pr-2 bg-gray-100 text-sm text-black focus:outline-none placeholder-gray-500 placeholder:text-xs">
                    {/* Password Input */}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handlePasswordFocus} 
                      className="w-full p-2 text-sm bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                      placeholder="New password"
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

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="ml-11 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                    placeholder="Confirm password"
                  />

                  {error && <p className="text-red-500 text-xs ml-12 mt-1">{error}</p>}
                  {success && <p className="text-green-500 text-xs ml-12 mt-1">{success}</p>}
                
                  <button className="ml-36 mt-10 w-20 rounded-lg bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-2 border-blue-50 text-white px-2 py-2 text-xs font-medium">
                      Submit
                  </button>
                </form>
            </div>
            
            
            </div>
            {/* Modal */} 
            <CommonSuccessModal
                title="Success"
                message="Your password has been reset successfully!"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal function
            />
        
        </div>
        
    );
};
  
  export default ResetPassword;

  
