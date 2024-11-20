
import { FaUserCircle } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
// import logo from "../assets/logo2.png";
import logo from "../../assets/userImgs/logo2.png";
import { useNavigate } from 'react-router-dom';
import  { logout }  from '../../slices/loginSlice';
import { useDispatch } from 'react-redux';
import Modal from '../../utils/users/userLogout';
import {HomeIcon, PhChalkboardTeacher, MingcuteNotificationLine, JamMessage, 
  PepiconsPopMenu, IconParkSolidDownOne, LetsIconsCloseRound, RiLogoutCircleRLine}  from "../../assets/usersIcons/HeaderIcon";
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';



const Header = () => {
  const dispatch = useDispatch(); // Initialize useDispatch
  const userRole = localStorage.getItem('userRole')


  const [profileData, setProfileData] = useState({
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    profilePic: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        // const res = await axiosInstance.get('/student/profile');
        const res = await axiosInstance.get(`/${userRole}/profile`);


        console.log("res profile data in update all data------------",res.data);
        console.log("res profile data in update all profile------------",res.data.email);
        console.log("res profile data in update data------------",res.data.message);


        const { email, role,  firstName, lastName, profilePicUrl } = res.data;

       
        


        setProfileData({
          email: email || '',
          role: role || '',
          firstName: firstName || '',
          lastName: lastName || '',
          profilePic: profilePicUrl || '',
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false); // New state for role switch modal

  const navigate = useNavigate();


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
        dispatch(logout());
        
        window.location.reload();
        setTimeout(() => {
          navigate('/login');
        }, 500); // 500ms delay

    };


    const handleRoleSwitchClick = () => {
      setIsRoleSwitchModalOpen(true); // Show role switch confirmation modal
      setIsDropdownOpen(false); // Close dropdown menu after selection
    };
  
    const handleCloseRoleModal = () => {
      setIsRoleSwitchModalOpen(false);
      setIsRoleSwitchModalOpen(false); // Close both modals
      setIsDropdownOpen(false);
    };


    
    console.log("bbbbbbbbbbbbbmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", userRole);



    const handleRoleSwitch = async () => {
      try {
        // let response = await axiosInstance.post('/student/switch-role');
        let response = await axiosInstance.post( `/${profileData?.role}/switch-role`);

        // Close the modal after confirming the switch
          handleCloseRoleModal();
          localStorage.removeItem('token');
          window.location.reload();
          setTimeout(() => {
            navigate('/login');
          }, 500); // 500ms delay
      } catch (error) {
          console.error('Error switching role:', error);
      }
    };





    return (
    <div className="bg-gray-100 flex flex-col">

      {/* Overlay for background shade */}
      {isDropdownOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
      )}


        {/* Header */}
        <header className="bg-navy-blue shadow relative z-50">
            <div className="my-1 h-16 px-4 py-2 flex items-cente gap-x-20">
              <div className='-mt-1.5'>
                <img src={logo} alt="My Local" className="h-12" />
              </div>

              <div className="flex items-center bg-transparent rounded-md mt-3 px-3 py-2 w-94 h-7 gap-x-5">
                <input
                  type="text"
                  className="flex-grow bg-transparent text-white focus:outline-none placeholder-gray-200 placeholder:text-xs"
                  placeholder="Search Instructor, session, Groups, etc"
                />
                <button type="submit" className=" text-white hover:bg-gray-700">
                  <FaSearch className="text-gray-300 ml-2 mt-1 size-3" />
                </button>
              </div>

              <div className='w-0.2 h-12 bg-transparent'>
                {/* middle line */}
              </div>

              <div className="flex space-x-12">
                <li className="flex items-center">
                  <a href="/">
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-transparent'>
                        <HomeIcon />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/about">
                    <PhChalkboardTeacher />
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/contact">
                    <MingcuteNotificationLine />
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/blog">
                    <JamMessage />
                  </a>
                </li>
              </div>

              <div className="flex space-x-10 ml-48">
                  <li className="flex items-center">
                    <a href="/profile">
                        <p className='text-white'>{profileData.firstName} {profileData.lastName}</p>
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="/profile">
                      {profileData && profileData.profilePic ? (
                          <img
                          src={profileData.profilePic}
                          className="w-10 h-10 object-cover rounded-full cursor-pointer"
                          alt="Student Profile"
                          />
                      ) : (
                          <FaUserCircle className="w-8 h-8 text-white cursor-pointer" />
                      )}
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#!" className="mt-1" onClick={handleDropdownToggle}>
                        <IconParkSolidDownOne />
                     </a>
                  </li>
              </div>




              {/* Dropdown Menu */}
              {isDropdownOpen && (
                  <div className="absolute -right-0 mt-12 mr-20  w-52 bg-white shadow-lg rounded-lg z-50">
                      <ul className="py-2">
                          {/* Close Button */}
                          <div
                              className="position-absolute w-8 h-8  rounded-full p-1 cursor-pointer ml-40 hover:bg-gray-200" onClick={handleDropdownToggle}  >
                              <LetsIconsCloseRound />{/* Close Icon */}
                              
                          </div>
                          {/* Switch Role Option */}
                          <li onClick={handleRoleSwitchClick} className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                              <span className="text-gray-700">👤</span> 
                              <a href="#!" className="text-gray-700">
                                Switch Account
                              </a>
                          </li>

                          {/* Logout Option */}
                          <li 
                              className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" 
                              onClick={handleLogoutClick}
                          >
                              <RiLogoutCircleRLine /> 
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



              {/* switch role Confirmation Modal */}

              {isRoleSwitchModalOpen && (
                  <Modal title="Confirm Role Switch" onClose={handleCloseRoleModal} onConfirm={handleRoleSwitch}>
                    <p>Are you sure you want to switch your role?</p>
                  </Modal>
                )}




            </div> 
        </header>
      </div>
    );
  };
  
  export default Header;

  
