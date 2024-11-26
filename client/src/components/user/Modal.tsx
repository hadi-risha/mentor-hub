import React, { useState, useRef } from 'react';
import Modal from 'react-modal';


const UserModal: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);

  const openModal = () => setIsOpen(true);

  const afterOpenModal = () => {
    if (subtitleRef.current) {
      subtitleRef.current.style.color = '#f00'; // Set subtitle color
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={openModal}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2
          ref={subtitleRef}
          className="text-xl font-bold mb-4 text-gray-800"
        >
          Confirmation Required
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to proceed with this action?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Proceed
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserModal;
