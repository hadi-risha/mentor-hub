import logo from "../../assets/adminImgs/adminLogo.png";
import developerImage from "../../assets/adminImgs/photo-hadi.jpg";
import {IcOutlineEmail, IcRoundSearch, LucideMenu, 
    MingcuteNotificationLine, IconParkSolidDownOne,
     RiLogoutCircleRLine, LetsIconsCloseRound,
     OcticonPerson24}  
    from "../../assets/adminIcons/HeaderIcons";
import React, { useState } from 'react';
import Modal from '../../utils/admin/adminLogoutModal';
import { useNavigate } from 'react-router-dom';


const AdminHeader = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Toggle dropdown visibility
    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Open logout confirmation modal
    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        // Remove the admin token from local storage
        localStorage.removeItem('adminToken');
        // Redirect to admin login page
        navigate('/admin/login');
    };
    
    return (
        <div className="bg-gray-100 flex flex-col">

            {/* Header */}
            <header className="bg-white shadow">
                <div className="my-0 h-20 px-0 flex items-cente gap-x-8">
                    <div className=' bg-navy-blue w-80 h-32px -mt-3'>
                        <img src={logo} alt="My Local" className="mt-4 w-56 h-16 ml-8" />
                    </div>

                    <div className="flex space-x-7">
                        <li className="flex items-center cursor-pointer">
                            <LucideMenu />
                        </li>

                        <li className="flex items-center pl-9 cursor-pointer">
                            <IcOutlineEmail />
                        </li>
                        <li className="flex items-center cursor-pointer">
                            <MingcuteNotificationLine />
                        </li>
                        <li className="flex items-center cursor-pointer">
                            <IcRoundSearch />
                        </li>
                    </div>

                    {/* logout button */}
                    <div className="flex space-x-4 ml-auto mr-10">
                        <li className="flex items-center">
                            <div className='w-12 h-12 flex items-center justify-center rounded-full bg-transparent overflow-hidden'>
                                <img src={developerImage} alt="My Local" className="w-full h-full object-cover" />
                            </div>
                        </li>
                        <li className="relative flex items-center">
                            <div className='flex space-x-3' onClick={handleDropdownToggle}>
                                <a href="#!" className="text-black font-medium">
                                    <p className='text-black font-medium'>Hadi Risha</p>
                                </a>
                                <a href="#!" className="mt-1">
                                    <IconParkSolidDownOne />
                                </a>
                            </div>



                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute -right-0 mt-56 w-44 bg-white shadow-lg rounded-lg">
                                <ul className="py-2">
                                    {/* Close Button */}
                                    <div
                                        className="position-absolute w-8 h-8  rounded-full p-1 cursor-pointer ml-32 hover:bg-gray-200" onClick={handleDropdownToggle}  >
                                        <LetsIconsCloseRound />{/* Close Icon */}
                                        
                                    </div>
                                    {/* Profile Option */}
                                    <li className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                                        <span className="text-gray-700">👤</span> {/* Profile Icon */}
                                        <a href="#!" className="text-gray-700">
                                            Profile
                                        </a>
                                    </li>
                                    {/* Logout Option */}
                                    <li 
                                        className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" 
                                        onClick={handleLogoutClick}
                                    >
                                        <RiLogoutCircleRLine /> {/* Logout Icon */}
                                        <a href="#!" className="text-gray-700">
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Confirmation Modal */}
                        {isModalOpen && (
                            <Modal
                            title="Confirm Logout"
                            onClose={handleCloseModal}
                            onConfirm={() => {
                                
                                handleLogout(); // Call handleLogout on confirm
                                handleCloseModal();
                            }}
                            >
                            <p>Are you sure you want to log out?</p>
                            </Modal>
                        )}


                        </li>
                    </div>
                </div> 
            </header>
        </div>
    );
};

export default AdminHeader;
