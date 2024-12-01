
import React, { useState, useRef, useEffect } from 'react';
import blueBgLogo from '../../assets/userImgs/gradientLogo.png';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { verifyOtp } from '../../slices/otpSlice';

// import { useAppDispatch } from '../../hooks/hooks'; 
import SuccessModal from "../../utils/users/successModal";
import config from '../../config'
import { setUserRole } from '../../slices/userRoleSlice';
import { useAppDispatch } from '../../redux/store';



const OtpVerification = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { email } = useParams();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);


    // const isOtpRequired = queryParams.get('timeractive') !== null;
    // console.log("isOtpRequired............in otp page", isOtpRequired);

    // set qhery value to false after 1 minut
    const [isOtpRequired, setIsOtpRequired] = useState(queryParams.get('timeractive') !== null); // Initial state based on URL


    // Effect to set isOtpRequired to false after 1 minute
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOtpRequired) {
            timer = setTimeout(() => {
                setIsOtpRequired(false); // Set to false after 1 minute
            }, 60000); // 60000 ms = 1 minute
        }
        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [isOtpRequired]);

    

    console.log("email", email);

    
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
    const [timerActive, setTimerActive] = useState(false); // To check if the timer is active

    const [serverResponse, setServerResponse] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isOtpRequired) {
            setTimerActive(true); // Start the timer only if the OTP is required
        }
    }, [isOtpRequired]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        setTimerActive(false); // Stop timer when it reaches 0
                        return 0; // Prevent negative time
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval); // Clear interval on component unmount or timer stop
    }, [timerActive, timeLeft]);


    const [otp, setOtp] = useState(Array(6).fill('')); // Initialize an array for 6 OTP inputs
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);  // Create refs for each input

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) =>  {
        const value = e.target.value;

        // Only allow numbers and restrict input to 1 character
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value; // Update the specific OTP input
    
            setOtp(newOtp); // Set the new OTP state
    
            // Clear error when the user interacts with the input
            setError(''); 
    
            // Focus the next input if there's a value
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus(); // Optional chaining to avoid null errors
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to the previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus(); // Optional chaining to avoid null errors
        }
    };

    // interface OtpResponse {
    //     message: string; // Adjust this based on the actual structure of your response
    //     success: boolean;
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Join the OTP array to form a string
        const otpString = otp.join('');

        if (otpString.includes('')) {
            alert('Input required: Please fill all OTP fields');
            return;
        }

        console.log("otpString........", otpString, email);
        

        if (!email) {
            setError('Email is required to verify OTP');
            return;
        }

        try {
            let isVerified = await dispatch(verifyOtp({ email, otp: otpString })).unwrap();
            console.log("isVerified---", isVerified);
            
            console.log('OTP verified successfully......redirect to homee......');

            let response = await dispatch(setUserRole("student"));
            console.log("response of otpverification", response);
            
            
            console.log('Navigating to /student/home');
            localStorage.setItem("userRole", "student");
            localStorage.setItem('isBlocked', String(false));  
            localStorage.setItem('isRoleChanged', String(false));
            navigate('/student/home');
        } catch (err: any) {
            console.error('Error occurred:', err);
            setOtp(Array(6).fill(''));
            setError(err.message || 'Failed to verify OTP');
        }
    };

    const handleResendOtp = async () => {
        if (!timerActive){
            try {
                setLoading(true); // Set loading state
                // const response = await axios.post('http://localhost:3001/api/auth/resend-otp', { email }); 
                const response = await axios.post(`${config.backendUrl}/auth/resend-otp`, { email });

                // alert(response.data.message); // Show success message
                setModalOpen(true); // Open the modal
                setServerResponse(response.data.message)
                setError(''); // Clear any previous errors
                setOtp(Array(6).fill('')); // Clear OTP input
                setTimeLeft(120); // Reset timer to 2 minutes
                setTimerActive(true); // Start the timer
            } catch (err: any) {
                console.error('Error resending OTP:', err);
                alert(err.response?.data?.message || 'Failed to resend OTP');
            } finally {
                setLoading(false); // Reset loading state
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false); // Function to close the modal
        setServerResponse(''); // Clear the error message

      };

  
    return (
    
        <div className="h-screen bg-gray-100">

            <h1 className="text-center py-14  text-black text-2xl font-bold">
                {/* Otp Verification */}
            </h1>
            <div className="rounded-xl flex -mt-6 ml-96 signup-container shadow-2xl shadow-slate-400 bg-white w-2/4 h-4/6 justify-center items-center">

            {/* right side */}
            <div className="w-1/2 h-full rounded-tl-xl rounded-bl-xl bg-login-custom-gradient items-center justify-center">
                {/* <img src={blueBgLogo} alt="My Local" className="ml-36 mt-24 h-24 w-24 rounded-full" /> */}
                <h1 className="mt-40 text-2xl font-bold text-white ml-16 ">Verify Your Account!</h1>
                <p className="text-white text-sm w-80 text-center ml-8 mt-4">Unlock your potential—let's dive into learning together!</p>
                
            </div>

            {/* left side */}
            <div className="w-1/2 h-full rounded-tr-xl  rounded-br-xl ">
                <h1 className="text-black font-bold font-sans text-xl mt-20 ml-28">OTP Verification</h1>
                <p className="mt-10 ml-14 text-black text-md w-64 text-center text-sm">Enter the OTP sent to your email for verification</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mt-11">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="mx-1 w-10 h-10 p-2 text-center border-2 rounded border-gray-400 bg-white text-black"
                                style={{
                                    MozAppearance: 'textfield',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                }}
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs ml-11 mt-2">{error}</p>}

                    {/* <p className="ml-52 mt-4 text-gray-500 text-xs">Resend OTP in <span className="text-black text-xs">00:07</span></p> */}
                    <p className="ml-32 mt-4 text-gray-500 text-xs">
                            Resend OTP in <span className="text-black text-xs">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
                        </p>
                        {!timerActive && (
                        <button 
                            type="button"
                            onClick={handleResendOtp}
                            className="ml-10 mt-4 w-72 underline border-transparent text-violet-700  text-sm font-medium"
                            disabled={loading || timerActive}
                        >
                            {loading ? 'Resending...' : 'Resend OTP'}
                        </button>
                        )}


                        {/* custom modal */}
                    <SuccessModal
                        message={serverResponse}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    />

                
                    <button 
                        type="submit"
                        className="ml-10 mt-10 w-72 rounded-lg bg-gradient-to-r from-green-500 via-green-6=700 to-green-800 border-2 border-green-50 text-white px-11 py-2 text-xs font-medium">
                        Verify OTP
                    </button>
                </form>
            
            </div>
            
            
            </div>
        
        </div>
        
    );
};
  
  export default OtpVerification;

  
