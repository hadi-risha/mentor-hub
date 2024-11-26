import React, {ReactNode} from 'react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}


const Modal: React.FC<ModalProps> = ({ title, children, onClose, onConfirm }) => {
  


  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-96 shadow-lg">
        <h2 className="text-xl font-medium mb-4 text-black font-serif">{title}</h2>
        <div className="mb-4 text-black">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-400 px-4 py-2 rounded-3xl hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#ff5c4c] text-white px-4 py-2 rounded-3xl hover:bg-[#3ee1a6] "
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
