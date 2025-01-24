import { PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, TypcnUserAdd } from '../../assets/usersIcons/ProfileIcons'
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

import upcomigSession from '../../assets/userImgs/upcoming-session1.jpeg';
import upcomigSession2 from '../../assets/userImgs/upcoming-session2.jpeg';





interface IBooking {
    _id: string;
    studentId: string;
    sessionId: {
        _id: string;
        title: string;
        duration: string;
        fee: string;
        descriptionTitle: string;
        coverImage: {
            url: string;
        };
    };
    instructorId: {
        // _id: string;
        firstName: string;
        lastName: string;
    };
    date: string;
    timeSlot: string;
    status: string;
    meetingRoomId:string;

}


const RecentSessions = () => {
    const navigate = useNavigate();  

    const [booking, setBooking] = useState<IBooking[]>([]); 
    const [loading, setLoading] = useState(true);

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
            const res = await axiosInstance.get('/student/profile');
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


    useEffect(() => {
        async function fetchBookings() {
          try {
            const response = await axiosInstance.get("/student/booked-sessions"); 
            
            const sessions = Object.values(response.data).filter(
            (item): item is IBooking => typeof item === "object" && item !== null && "_id" in item
            );
        
            console.log("Parsed Sessions:", sessions);
            
            setBooking(sessions); 
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
      
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
    const handleViewDetails = (bookingId: string, sessionId: string, date: string, time: string, meetingRoomId: string) => {
        navigate(`/student/reserved-session/${sessionId}`, {
            state: {
                bookingId,
                date,
                time,
                meetingRoomId
            },
        });
    };
  

  return (
    <>
        <div className='w-screen h-auto bg-white overflow-x-hidden'>

            {/* first part */}
            {/* <div className='bg-white w-10/12 h-48  ml-32 mt-5  rounded-tl-lg rounded-tr-lg shadow'>
                <div className='w-full h-32 bg-[#fbcfb1] rounded-tl-lg rounded-tr-lg object-cover bg-center'>
                    <div className='flex w-full h-3 pl-10 pt-8'>

                        {profileData && profileData.profilePic ? (
                            <img
                            src={profileData.profilePic}
                            className="w-20 h-20 object-cover rounded-full"
                            alt="Student Profile"
                            />
                        ) : (
                            <FaUserCircle className="w-20 h-20 text-white" />
                        )}

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

                    <div className='mt-28 ml-10 flex'>
                        <div>
                            <p className='font-normal text-gray-700 font-serif'>{profileData.firstName} {profileData.lastName}</p>
                            <p className='font-light text-sm text-gray-700'>{profileData.role}</p>
                        </div>

                        <div className='flex space-x-20 ml-40'>
                            <a href={"/student/profile"}>
                                <p className='text-lg font-serif text-black'>About</p>
                            </a>
                            <div>
                                <p className='text-lg font-serif text-primary-orange'>Reserved Sessions</p>
                                <TeenyiconsUpSolid className='mt-2 ml-14' />
                            </div>
                            <a href={"/student/session-history"}>
                                <p className='text-lg text-black font-serif'>Session History</p>
                            </a>
                            <p className='text-lg font-serif text-black'>Posts</p>
                        </div>

                        <div className='ml-auto mr-6'>
                            <div className='bg-[#f6f6f6] w-10 h-10 -mt-2 rounded-full flex items-center justify-center hover:border hover:border-black'>
                                <SolarMenuDotsBold />
                            </div>
                        </div>
                    </div> 
                </div>   
            </div> */}



            {/* UPCOMING SESSION CARDS */}
            {/* <div className="ml-32 mr-32 mt-8 mb-36 h-auto py-16 px-7 shadow-md grid grid-cols-3 gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : booking.length > 0 ? (
                    booking.map((session) => (
                        <div key={session._id} className='relative w-[380px] h-[460px] rounded-2xl border-2 border-black'>
                            <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div> 
                            <div className='w-full h-full rounded-2xl' style={{ backgroundImage: `url(${session.sessionId.coverImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className='absolute bottom-0 left-0 w-full  bg-opacity-60 py-4 px-7 text-white rounded-b-2xl'>
                                <h3 className='mb-3 text-2xl font-bold font-serif'>{session.sessionId?.title}</h3>
                                <p className='text-lg mb-5'>Mentor: {session.instructorId.firstName} {session.instructorId.lastName}</p>
                                <p className='text-lg mb-5'>Date: {formatDate(session.date)}</p>
                                <p className='text-lg mb-5'>Time: {session.timeSlot}</p>
                                
                                
                                { session.status === 'cancelled' ? (
                                    <div 
                                        className='mt-2 mb-7 w-7/12 py-1 px-5 bg-red-500 text-black rounded-full'>
                                        Session Cancelled
                                    </div>

                                ) : (
                                    <button 
                                        onClick={() => handleViewDetails(session._id, session.sessionId._id, session.date, session.timeSlot, session.meetingRoomId)}
                                        className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] text-black rounded-full hover:bg-[#2cc58a] transition duration-300 transform hover:scale-105 active:scale-95'>
                                        View Details
                                    </button> 
                                )}


                            </div>
                        </div>
                    ))
                ) : (
                    <p>No upcoming sessions available.</p>
                )}
            </div> */}





            <div className="ml-32 mr-32 mt-8 mb-36 h-[530px] shadow-2xl flex "> 

                <div className='w-3/12 h-auto px-10 py-10 space-y-6 border-r border-gray-200'>
                    <div className="px-3 py-1 w-10/12 h-auto text-sm bg-gray-200 border text-black border-black rounded-full flex justify-center items-center">
                    Reserved Sessions
                    </div>
                    
                    <div className="px-3 py-1 w-10/12 h-auto text-sm border text-gray-700 border-gray-400 rounded-full flex justify-center items-center">
                        <a href={"/student/session-history"}>
                            Session History
                        </a>
                    </div>
                </div>


                <div className='w-full py-10 px-5 overflow-y-scroll'>

                    {/* image part */}
                    <div className="flex h-[370px]">
                        {/* First Column */}
                        <div className="w-1/3 bg-[#d9ffaa] flex flex-col justify-center items-center text-center space-y-10">
                            <p className="text-[#0a5c45]">( Events )</p>
                            <p className="text-black font-serif text-5xl font-thin">
                                Upcoming sessions
                            </p>
                        </div>

                        {/* Second Column */}
                        <div className="w-1/3 bg-blue-200 flex justify-center items-center">
                            <img src={upcomigSession} alt="" className='w-full h-full object-cover' />
                        </div>

                        {/* Third Column */}
                        <div className="w-1/3 bg-[#d9ffaa] flex flex-col justify-center items-center text-center space-y-5">
                            <p className="text-black font-serif text-xl font-thin">Learn Typescript basics</p>
                            <p className="text-black font-mono text-lg font-thin">October 22-24, 2024</p>
                            <button className="w-10 h-10 border jumping bg-[#3ee1a6] border-black text-black rounded-full flex items-center justify-center shadow-lg transition duration-300 ">
                                <span className="text-xl">↓</span>
                            </button>
                        </div>

                    </div>


                    

                </div>




                
                
            </div>



            {/* CSS for animation */}
            <style>{`
                @keyframes slide {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                @keyframes jump {
                0%, 100% {
                transform: translateY(0);
                }
                50% {
                transform: translateY(-8px);
                }
            }

            .jumping {
                animation: jump 1s ease-in-out infinite;
            }
            `}</style>

        </div>
    </>
  )
}

export default RecentSessions;
