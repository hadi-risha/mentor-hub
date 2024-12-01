import React, { useEffect } from 'react';
import { CharmCircleTick, EpSuccessFilled } from '../../assets/usersIcons/SessionIcons';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    navigate('/student/upcoming-sessions');
  };
   
  return (
    <>
      <div className="w-screen h-screen bg-white flex justify-center items-center -mt-11">
        <div className="px-16 py-20 rounded-2xl text-center space-y-3 shadow-lg">
            {/* <CharmCircleTick className='ml-28' /> */}
            <EpSuccessFilled className='ml-28' />
            <h1 className="text-black font-bold text-xl font-serif">Payment Successful!</h1>
            <p className="text-black font-light text-sm">Your session has been successfully Reserved.</p>
            <button 
            onClick={handleBooking}
            className="w-20 h-8 text-black bg-[#c291fe] font-semibold text-md rounded-3xl hover:bg-[#f6f6f6] hover:border hover:border-black">Ok</button>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
