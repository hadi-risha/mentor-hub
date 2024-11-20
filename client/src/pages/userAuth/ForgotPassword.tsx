
import { useEffect, useState } from 'react';
import blueBgLogo from '../../assets/userImgs/gradientLogo.png';
import ErrorModal from '../../utils/users/ErrorModal';
import ForgotPswSuccessModal from '../../utils/users/forgotPswSuccessModal';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { requestPasswordReset, resetState } from '../../slices/forgotPasswordSlice';

const ForgotPassword = () => {

  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.forgotPassword);
  
  const [email, setEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputError, setInputError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setInputError('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setInputError('Please enter a valid email address.');
      return;
    }

    setInputError(''); // Clear error if validation passes


    dispatch(requestPasswordReset(email)); // Dispatch the forgot password request
  };

  useEffect(() => {
    console.log("Error:", error);
    console.log("Success Message:", successMessage);

    if (successMessage) {
        setIsModalOpen(true); // Open modal on success message
    }
}, [successMessage, error]);


const handleCloseModal = () => {
  setIsModalOpen(false); // Close modal
  dispatch(resetState()); // Reset state after closing the modal
  setEmail(''); // Clear the email input when the modal is closed
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
                <h1 className="text-2xl font-bold text-white ml-16 mt-5">Recover Your Account!</h1>
                <p className="text-white text-sm w-80 text-center ml-8 mt-4">Unlock your potential—let's dive into learning together!</p>

            </div>

            {/* left side */}
            <div className="w-1/2 h-full rounded-tr-xl  rounded-br-xl ">
                <h1 className="text-black font-bold font-sans text-xl mt-28 ml-28">Forgot Password</h1>
                <p className="mt-10 ml-14 text-gray-500 text-md w-64 text-center text-xs">Please provide the email address that you used when 
                   you signed up for your account</p>

                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputError('')}
                    className="ml-11 mt-3 w-72 p-2 flex-grow rounded-md bg-gray-100 text-black text-sm focus:outline-none placeholder-gray-500 placeholder:text-sm"
                    placeholder="Enter your email"
                  />
                  {inputError && <p className="error text-red-500 text-xs mt-1 ml-12">{inputError}</p>}
                  {error && <p className="error text-red-500 text-xs mt-1 ml-11">{error}</p>}
                
                
                  <button className="ml-36 mt-10 w-20 rounded-lg bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-2 border-blue-50 text-white px-2 py-2 text-xs font-medium">
                      Send
                  </button>

                  
                  {/* Modal for Success Message */}
                    <ForgotPswSuccessModal
                      message={successMessage || ''} // Pass the success message
                      isOpen={isModalOpen} // Control modal visibility
                      onClose={handleCloseModal} // Handle modal close
                    />
                </form>
            
            </div>
            
            
            </div>
        
        </div>
        
    );
};
  
  export default ForgotPassword;

  
