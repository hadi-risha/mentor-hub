import { TypcnUserAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, MaterialSymbolsAdd } from '../../assets/usersIcons/ProfileIcons'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/users/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Modal from '../../utils/users/userLogout';





interface ISession {
    _id: string;
    title: string;
    introduction: string;
    duration: string;
    fee: number;
    descriptionTitle: string;
    description: string;
    timeSlots: string[];
    coverImage: {
        key: string | '';
        url: string | '';
      };
    instructorId: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    
}


const Sessions = () => {
    const navigate = useNavigate();  // Initialize navigate function

    const [sessions, setSessions] = useState<ISession[]>([]); // Typed state
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const [profileData, setProfileData] = useState({
        role: '',
        firstName: '',
        lastName: '',
        occupation: '',
        currentInstitution: '',
        profilePic: '',
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axiosInstance.get('/instructor/profile');
                console.log("res profile data in update all data------------",res.data);
                console.log("res profile data in update data------------",res.data.message);

                const {
                    role,
                    firstName, 
                    lastName,
                    occupation, 
                    currentInstitution, 
                    profilePicUrl } = res.data;

                setProfileData({
                    role: role || '',
                    firstName: firstName || '',
                    lastName: lastName || '',
                    occupation: occupation || '',
                    currentInstitution: currentInstitution || '',
                    profilePic: profilePicUrl || '',
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
        fetchProfile();
    }, []);


    useEffect(() => {
        async function fetchBookings() {
          try {
            const response = await axiosInstance.get("/instructor/available-sessions"); // Adjust the endpoint if needed
            
            const sessions = Object.values(response.data).filter(
            (item): item is ISession => typeof item === "object" && item !== null && "_id" in item
            );
        
              console.log("Parsed Sessions:", sessions);
            

            
            console.log("response           1", response);
            console.log("response.data:      2", response.data);
            console.log("response           3", response.data.booking);
            console.log("response           3", response.data.instructorId);



            // session?.instructorId?.image?.key
      
            console.log("response           2", response.data.session);
            
            setSessions(sessions); // Store the booking data
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
      
        console.log("booking------------------55", sessions);
        fetchBookings();
    }, []);


    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      };


      // Handle click event to navigate to session details page
  const handleViewDetails = (sessionId: string) => {
    navigate(`/instructor/session/${sessionId}`);
  };



  const handleUpdate = (id: string) => {
    // navigate(`/student/session`, { state: { sessionId: id } });
    navigate(`/instructor/update-session/${id}`);
};





const handleDelete = async (id: string) => {
    
    try {
        const response = await axiosInstance.delete(`/instructor/delete-session/${id}`);
        console.log("response",response);
        
    } catch (error) {
        console.error('Error switching role:', error);
    }
  };


  const handleDeleteClick = (id: string) => {
    setSelectedSessionId(id); // Store the ID of the session to delete
    setIsModalOpen(true); // Show the modal
  };

  

  return (
    <>
      <div className='w-screen h-auto bg-white'>


        <div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg shadow'>
            {/* first part */}
            <div className='w-full h-32 bg-[#fbcfb1] rounded-tl-lg rounded-tr-lg object-cover bg-center' >
                
                {/* profile photo section */}
                <div className='flex w-full h-3 pl-10 pt-8'>
                    {profileData && profileData.profilePic ? (
                        <img
                            src={profileData.profilePic} className="w-20 h-20 object-cover rounded-full" alt="Instructor Profile"
                        />
                    ) : (
                        <FaUserCircle className="w-20 h-20 text-white" />
                    )}

                    <div className='pl-5 pt-2'>
                        <p className='text-lg text-black font-medium font-serif'>{profileData.firstName} {profileData.lastName}</p>
                        <p className='text-gray-600'>{profileData.role}</p>
                    </div>

                    <div className='flex ml-auto bg-white w-80 h-16 space-x-6 pl-9 pt-2 rounded-tl-md rounded-bl-md'>
                        <div className='w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center '>
                            <TypcnUserAdd />
                        </div>
                        <div className='w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center'>
                            <PrimeStarFill />
                        </div>
                        <div className='w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center'>
                            <AntDesignMessageFilled />
                        </div>
                        <div className='w-12 h-12 bg-violet-400 rounded-full flex items-center justify-center'>
                            <FluentNotepadEdit16Filled />
                        </div>
                    </div>

                </div>



               

                {/* options section */}
                <div className='mt-28 ml-10 h-auto flex'>
                    <div>
                        {profileData.occupation && 
                            <p className='font-semibold text-gray-700'>Position: 
                                <span className='font-normal text-gray-700'> {profileData.occupation}</span>
                            </p>
                        }
                        {profileData.currentInstitution && 
                            <p className='font-semibold text-gray-700'>Institution: 
                                <span className='font-normal text-gray-700'> {profileData.currentInstitution}</span>
                            </p>
                        }
                    </div>

                    <div className='flex space-x-20 ml-40'>
                        <a href={"/instructor/profile"}>
                            <p className='text-black font-serif text-lg'>About</p>
                        </a>
                        <div>
                            <p className='text-primary-orange font-serif text-lg'>Session Actions</p>
                            <TeenyiconsUpSolid className='ml-12 mt-2' />
                        </div>
                        <a href={"/instructor/booked-sessions"}>
                            <p className='text-black font-serif text-lg'>Confirmed Sessions</p>
                        </a>
                    </div>

                    <div className="ml-auto mr-6 relative group">
                        <a href="/instructor/create-session">
                            <div className="bg-[#f6f6f6] w-10 h-10 -mt-2 rounded-full flex items-center justify-center hover:border hover:border-black">
                                <MaterialSymbolsAdd />
                            </div>
                        </a>
                        {/* Tooltip for text */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Create
                        </div>
                    </div>

                </div> 
            </div>   
        </div>


        {/* UPCOMING SESSIONS */}
        <div className="ml-28 mr-36 mt-8 mb-36 h-auto py-16 px-5 shadow-2xl grid grid-cols-3 gap-6">

            {loading ? (
                <p>Loading...</p>
            ) : sessions.length > 0 ? (
                sessions.map((session) => (
                    <div key={session._id} className='relative w-[380px] h-[460px] rounded-2xl border-2 border-black'>
                        <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div> {/* Black overlay */}
                        <div className='w-full h-full rounded-2xl' style={{ backgroundImage: `url(${session.coverImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className='absolute bottom-0 left-0 w-full  bg-opacity-60 py-4 px-7 text-white rounded-b-2xl'>
                            <h3 className='mb-3 text-2xl font-bold font-serif'>{session.title}</h3>
                            {/* <p className='text-lg mb-5'>Mentor: {session.instructorId.firstName} {session.instructorId.lastName}</p> */}
                            <p className='text-lg mb-5'>Fees: ₹{session.fee}</p>
                            
                            <div className='ml-14 space-x-5'>
                                <button 
                                    onClick={() => handleUpdate(session._id)} 
                                    className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] border-2 border-white text-black rounded-full hover:border-[#2cc58a]  transition duration-300 transform hover:scale-105 active:scale-95'>
                                    Update
                                </button>
                                <button 
                                    // onClick={() => handleDelete(session._id)}
                                    onClick={() => handleDeleteClick(session._id)}
                                    className='mt-2 mb-7 py-1 px-4 bg-red-500 border-2 border-white text-black rounded-full hover:border-[#2cc58a]  transition duration-300 transform hover:scale-105 active:scale-95'>
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                <p>No upcoming sessions available.</p>
            )}
            

        </div>



        {/* Modal */}
        {isModalOpen && (
            <Modal
            title="Confirm Deletion"
            onClose={() => setIsModalOpen(false)} // Close the modal without action
            onConfirm={() => handleDelete(selectedSessionId!)} // Proceed with deletion
            >
            Are you sure you want to delete this session? 
            </Modal>
        )}



      </div>
    </>
  )
}

export default Sessions;
