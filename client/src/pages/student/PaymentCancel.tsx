
import React from 'react';
import { SystemUiconsCrossCircle } from '../../assets/usersIcons/SessionIcons';
import { useNavigate } from 'react-router-dom';

const PaymentCancel: React.FC = () => {

  const navigate = useNavigate();

  const handleClick = async () => { 
    navigate('/student/home')
  };   
   


  return (
    <>
      <div className="w-screen h-screen bg-white flex justify-center items-center -mt-11">
        <div className="px-16 py-20 rounded-2xl text-center space-y-3 shadow-lg">
          <SystemUiconsCrossCircle className='ml-28' />
          <h1 className="text-black font-bold text-md">Payment Failed!</h1>
          <p className="text-black font-light text-sm">Oops! Something went wrong with your payment. Please try again.</p>
          <button 
            onClick={handleClick}
            className="w-20 h-8 text-white bg-red-400 font-bold text-md rounded-3xl">Ok</button>
        </div>
      </div>
    </>
  );
}

export default PaymentCancel;

