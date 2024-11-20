
import React from 'react';

interface ModalProps {
    message:string;
    isOpen: boolean;
    onClose: () => void;
}

const LoginErrorModal: React.FC<ModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Error</h2>
        <p className='text-black'> {message} </p>
        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default LoginErrorModal;
