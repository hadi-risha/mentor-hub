
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../slices/loginSlice'; 
import { AppDispatch } from '../../redux/store';
import { unwrapResult } from '@reduxjs/toolkit';

interface ModalProps {
    message:string;
    isOpen: boolean;
    email:string;
    onClose: () => void;
    onCancel: () => void;
}

const VerifyEmailModal: React.FC<ModalProps> = ({ message, isOpen,email, onClose, onCancel }) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<AppDispatch>();
    // const [isLoading, setIsLoading] = useState(false);
    const otpLoading = useSelector((state: any) => state.login.otpLoading);
    
    const [isLoading, setIsLoading] = useState(false);


    if (!isOpen) {
        return null;
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('isLoading:', isLoading, 'otpLoading:', otpLoading);

        try {
            // Dispatch action to send OTP
            const resultAction = await dispatch(sendOtp({ email }));
            const result = unwrapResult(resultAction);
            console.log("result", result);
            
            
            // Navigate to the OTP verification page
            navigate(`/otp-verification/${encodeURIComponent(email)}?timeractive=true`);
        } catch (error) {
            // console.error("Failed to send OTP:", error);
            console.error("Failed to send OTP:", (error as { message?: string }).message || 'Unknown error');
        } finally {
            setIsLoading(false); // Stop loading state
            onClose(); // Close the modal
        }
    };
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Verify now</h2>
        <p className='text-black'> {message} </p>
        {/* <form onSubmit={handleVerify} className="flex justify-center items-center"> */}
        <div className="flex justify-center items-center"> 
            <button
                type="submit"
                onClick={handleVerify}
                disabled={isLoading || otpLoading}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
                {isLoading || otpLoading ? 'Sending' : 'Verify'}
            </button>

            <button
            className="mt-4 ml-2 bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
            onClick={onCancel}
            >
            Close
            </button>
        </div>
        {/* </form> */}

        
      </div>
    </div>
  );
};

export default VerifyEmailModal;
