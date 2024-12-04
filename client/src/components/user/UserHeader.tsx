import { FaUserCircle } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import  { logout }  from '../../slices/loginSlice';
import { useDispatch } from 'react-redux';
import Modal from '../../utils/users/userLogout';
import { IconParkSolidDownOne, LetsIconsCloseRound, RiLogoutCircleRLine }  from "../../assets/usersIcons/HeaderIcon";
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';


interface IBookingStatus {
  status: "booked" | "completed" | "cancelled";
  studentId?: string;
  date?: string;
  timeSlot?: string;
}

interface ISearchSession {
  _id: string;
  title: string;
  description: string;
  coverImage: { url: string };
  bookingStatus?: IBookingStatus;
}


const Header = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false); // state for role switch modal


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ISearchSession[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);  // State to toggle search result visibility


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
        const res = await axiosInstance.get(`/${userRole}/profile`);
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
    
  console.log("userRole in header", userRole);


  const handleSearchInput = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);  // Show results when searching starts

    try {
      let response;

      if (profileData.role === 'student') {
         response = await axiosInstance.get(`student/sessions/search`, {
          params: { query: searchQuery },
        });


        console.log("student serach result", response);
        
        
      }else if (profileData.role === 'instructor') {
        console.log("searching in instructor----------------------------------------------------------------------");
        
         response = await axiosInstance.get(`instructor/sessions/search`, {
          params: { query: searchQuery },
        });
        console.log("instructor serach result", response);
        console.log("instructor serach", response.data.searchResults);

      }
      
      setSearchResults(response?.data?.searchResults);
      
    } catch (error) {
      console.error("Error searching sessions:", error);
    } finally {
      setIsSearching(false);
    }
  };


  const handleCloseSearchResults = () => {
    setShowResults(false);
    setSearchQuery("");  // Optional: Clear search query when closing
  };

  const handleArrowClick = () => {
    setShowResults(false);  // Close search results on arrow button click

  };

  const handleInstructorArrowClick = (sessionId: string) => {
    setShowResults(false); 
    navigate(`/instructor/session/${sessionId}`);

  };



  const handleRoleSwitch = async () => {
    try {
      let response = await axiosInstance.post( `/${profileData?.role}/switch-role`);

      // close the modal after confirming the switch
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
      <div className="bg-blackfixed inset-0 opacity-70 z-40"></div>
    )}

    {/* Header */}
    <header className="bg-[#f6f6f6] shadow relative z-50">

      <div className="mt-0 my-1 pl-28 pr-32 py-5 h-20 bg-navy-blue  flex items-cente justify-between">
      {/* <div className="mt-0 my-1 pl-28 pr-32 py-5 h-20 bg-[#73816e]  flex items-cente justify-between"> */}

        <p className=' text-white font-mono font-semibold text-2xl'>C<span className='text-orange-600'>o</span>nnect</p>

        <div className="px-6 py-2 w-94 h-9 flex items-center bg-white rounded-full gap-x-5">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            className="search-input flex-grow bg-white text-black focus:outline-none placeholder-gray-400 placeholder:text-xs"
            placeholder="Search Instructor, session, Groups, etc"
          />
          <button onClick={handleSearchSubmit} type="submit" className="search-button px-3 py-1 rounded-full text-black hover:bg-gray-200">
            <FaSearch className=" ml-0 mt-1 size-4 text-gray-400" />
          </button>
        </div>

 

        {isSearching && <p>Loading...</p>}
        {showResults && (
            <div className="search-results absolute ml-[26%] mt-12 w-[370px] bg-white shadow-lg space-y-4 h-auto px-4 py-10 z-50">
              
            <button className="absolute top-0 right-4 p-2 cursor-pointer" onClick={handleCloseSearchResults}>
              <span className="text-gray-400 text-3xl hover:text-black">×</span>
            </button>

            {Array.isArray(searchResults) && searchResults.length === 0 && (
                <p className="text-center text-gray-500">No results found</p>
              )}

              {Array.isArray(searchResults) &&
                searchResults.map((session) => (
                  <div key={session._id} className="search-result-item px-7 py-5 border border-gray-600 rounded-md flex justify-between">
                    <img src={session.coverImage.url} alt={session.title} className="session-image w-7 h-7 rounded-full object-cover" />
                    <h3 className='text-xs w-40 text-black'>{session.title}</h3>

                  { profileData.role === 'student' ? (
                      <Link to={session.bookingStatus?.status === "booked" ? `/student/reserved-session/${session._id}` : `/student/session/${session._id}`}>
                      <button onClick={handleArrowClick} className='border border-gray-400 w-6 h-6 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                        <span className="text-gray-400 text-sm hover:text-blue-700">→</span>
                      </button>
                    </Link>
                    ) : (
                      // <Link to={`/instructor/session/${session._id}`}>  
                        <button onClick={() => handleInstructorArrowClick(session?._id)} className='border border-gray-400 w-6 h-6 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                          <span className="text-gray-400 text-sm hover:text-blue-700">→</span>
                        </button>
                      // </Link>
                    )

                  }
                  </div>
                ))}
            </div>
          )}



        

        

        <div className="flex space-x-3">
          <li className="flex items-center">
            <a href="/profile">
              {profileData && profileData.profilePic ? (
                  <img
                  src={profileData.profilePic}
                  className="w-10 h-10 object-cover border-2 border-[#3ee1a6] rounded-full cursor-pointer"
                  alt="Student Profile"
                  />
              ) : (
                  <FaUserCircle className="w-8 h-8 text-white cursor-pointer" />
              )}
            </a>
          </li>
          <li className="flex items-center">
            <a href="/profile">
                <p className='text-white font-serif'>{profileData.firstName} {profileData.lastName}</p>
            </a>
          </li>
          <li className="flex items-center ">
            <a href="#!" className="mt-1 relative group" onClick={handleDropdownToggle}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full group-hover:bg-gray-400 transition duration-300">
                  <IconParkSolidDownOne className="text-white group-hover:text-red-600 transition duration-300" />
                </div>
            </a>
          </li>
        </div>


        


        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute -right-0 mt-12 mr-36  w-52 bg-white shadow-lg rounded-lg z-50">
            <ul className="py-2">
              {/* Close Button */}
              <div
                className="position-absolute w-8 h-8  rounded-full p-1 cursor-pointer ml-40 hover:bg-gray-200" onClick={handleDropdownToggle}  >
                <LetsIconsCloseRound />
              </div>
              
              <li onClick={handleRoleSwitchClick} className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                <span className="text-gray-700">👤</span> 
                <a href="#!" className="text-gray-700">
                  Switch Account
                </a>
              </li>

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


        {/* Logout Confirmation Modal */}
        {isModalOpen && (
          <Modal
            title="Confirm Logout"
            onClose={handleCloseModal}
            onConfirm={() => {
                handleLogout(); 
                handleCloseModal();
            }}
          >
            <p>Are you sure you want to log out?</p>
          </Modal>
        )}


        {/* switch role Confirmation Modal */}
        {isRoleSwitchModalOpen && (
          <Modal 
            title="Confirm Role Switch" 
            onClose={handleCloseRoleModal} 
            onConfirm={handleRoleSwitch}
          >
            <p>Are you sure you want to switch your role?</p>
          </Modal>
        )}

      </div>


      {/* 2nd section */}
      {/* <div className="mt-0 my-1 pl-80 pr-96 py-5 h-12 bg-[#f6f6f6] flex items-cente justify-between"> */}
      <div className="sticky top-0 z-40 bg-[#f6f6f6] flex items-center justify-between pl-80 pr-96 py-5 h-12 shadow-md">


      
        
        <li className="flex items-center">
          <a href={`/${userRole}/home`}>
            <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
              <p className='text-black font-serif'>Home</p>
            </div>
          </a>
        </li>


        {userRole === 'instructor'? (
          <li className="flex items-center">
            <a href='/instructor/all-sessions'>
              <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
                <p className='text-black font-serif'>Sessions</p>
              </div>
            </a>
          </li>
        ): null}



        {userRole === 'student'? (
          <li className="flex items-center">
            <a href='/student/sessions'>
              <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
                <p className='text-black font-serif'>Sessions</p>
              </div>
            </a>
          </li>
        ): null}

        <li className="flex items-center">
          <a href={`/${userRole}/profile`}>
            <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
              <p className='text-black font-serif'>Profile</p>
            </div>
          </a>
        </li>

        <li className="flex items-center">
          <a href={`/${userRole}/chat`}>
            <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
              <p className='text-black font-serif'>Chat</p>
            </div>
          </a>
        </li>
        
        <li className="flex items-center">
          <a href={`/user/notifications`}>
            <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
              <p className='text-black font-serif'>notification</p>
            </div>
          </a>
        </li>

        <li className="flex items-center">
          <a href={`/${userRole}/community`}>
            <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
              <p className='text-black font-serif'>Community</p>
            </div>
          </a>
        </li>

        {userRole === 'student'? (
          <li className="flex items-center">
            <a href='/student/instructors'>
              <div className='w-auto h-auto py-1 px-3 rounded-full hover:bg-[#3ee1a6]'>
                <p className='text-black font-serif'>Instructors</p>
              </div>
            </a>
        </li>
        ): null}
            
      </div>

    </header>
  </div>
  );
};

export default Header;

  
