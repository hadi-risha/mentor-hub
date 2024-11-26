import React, { useEffect } from 'react';
import { CharmCircleTick, EpSuccessFilled } from '../../assets/usersIcons/SessionIcons';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {

  const navigate = useNavigate();


  const paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');

  // Only run this code if paymentData exists
  useEffect(() => {
    if (paymentData) {
      const { sessionId, selectedDate, selectedTimeSlot, concerns, amount } = paymentData;
      console.log("sessionId, selectedDate, selectedTimeSlot, concerns", sessionId, selectedDate, selectedTimeSlot, concerns);
    }
  }, [paymentData]);

  const handleBooking = async () => {
    if (!paymentData) {
      // alert("No payment data found. Please try again.");
      return;
    }

    try {
      // Prepare data to send
      const { sessionId, selectedDate, selectedTimeSlot, concerns } = paymentData;

      const dataToSend = {
        sessionId: sessionId, // You already have sessionId from useParams
        selectedDate: selectedDate, // Selected date from the URL query parameters
        selectedTimeSlot: selectedTimeSlot, // Selected time from the URL query parameters
        concerns: concerns, // User's concerns input
      };

      const response = await axiosInstance.post('/student/create-booking', dataToSend);

      // Access the response data
      console.log("session booked, response.data", response.data);
      // alert("Session booked successfully!");
      navigate('/student/upcoming-sessions');

      
    } catch (error) {
      console.error("Error creating session:", error);
      // alert("Failed to book session. Please try again.");
    }
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
