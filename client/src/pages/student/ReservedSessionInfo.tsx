import instructor from '../../assets/userImgs/instructor.png';
import { EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../utils/users/userLogout';


interface ISession {
    _id: string;
    title: string;
    introduction: string;
    fee: number;
    duration: string;
    descriptionTitle: string;
    description: string;
    coverImage: {
      url: string;
      key: string;
    };
    instructorId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
}

const ReservedSessionInfo = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation(); // access state from navigation
    const { bookingId, date, time, meetingRoomId } = state || {}; 
    

    const [session, setSession] = useState<ISession>();
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionCancelled, setSessionCancelled] = useState(false);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await axiosInstance.get(`/student/session/${id}`); 
                console.log("response : ", response.data.session);
                setSession(response.data.session); 
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch session:', error);
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    const formatDuration = (duration: string): string => {
        if (!duration) return 'N/A'; // handle missing duration
        const [hours = 0, minutes = 0] = duration.split(':').map(Number);
        const hourText = hours ? `${hours} hr` : '';
        const minuteText = minutes ? `${minutes} min` : '';
        return [hourText, minuteText].filter(Boolean).join(' ');
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const convertTo12HourFormat = (time24: string): string => {
        const [hours, minutes] = time24.split(':').map(Number); 
        const period = hours >= 12 ? 'PM' : 'AM';
        const convertedHours = hours % 12 || 12; // convert to 12-hour format
        return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${period}`; // format with leading zero if needed
    };

    const handleCancelSession = async () => {
        try {
          const response = await axiosInstance.put('/student/cancel-booking', { bookingId } );
          console.log("response111111111111111111", response);
          
          // Handle response
        //   if (response.status === 200) {
        //     setButtonText('Session Cancelled');
        //     // navigate('/student/upcoming-sessions');            
        //   }

            setSessionCancelled(true)
            // navigate('/student/upcoming-sessions');  
        } catch (error) {
          console.error('Error canceling booking:', error);
          alert('An error occurred while canceling the booking.');
        }
    };
  

    return (
        <>
            <div className='mx-32 py-14 w-screen h-screen bg-[white]'>
                <div className='h-auto pb-32 bg-[#f6f6f6] rounded-2xl'>
                    <div className='bg-[#40ab84] rounded-t-2xl w-full h-48 pt-6 flex pl-28 shadow'>

                        <Link to={"/student/upcoming-sessions"}>
                            <div className='border border-white w-10 h-10 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                                <span className="text-white text-xl">←</span>
                            </div>
                        </Link>

                        <div className='ml-14 w-5/12'>
                            <h1 className='text-xl text-white font-bold font-serif'>{session?.title}</h1>
                            <p className='mt-6 '>{session?.introduction}</p>
                            <div className='flex space-x-3 mt-5'>
                                <p className='text-sm font-serif'>Instrucror overall rating:</p>
                                <div className='flex space-x-1 '>
                                    <EmojioneStar />
                                    <EmojioneStar />
                                    <EmojioneStar />
                                    <EmojioneStar />
                                    <EmojioneMonotoneStar />
                                </div>
                            </div>
                        </div>

                        {/* SESSION CARD */}
                        <div className='ml-44 bg-white w-3/12 h-[595px] flex flex-col justify-center items-center border-2 border-gray-300'>
                            <div className='-mt-14 bg-white w-full h-2/5 border-2 border-gray-300 '>
                                <img
                                    src={session?.coverImage.url}
                                    alt={session?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                                <div className='flex items-center space-x-3'>
                                    <img src={instructor} className=' w-12 h-12 object-cover rounded-full' alt="" />    
                                    <p className='text-blue-950 font-serif'>{session?.instructorId.firstName} {session?.instructorId.lastName}</p>
                                </div>
                                <div className='flex mt-3 space-x-2 '>
                                    <p className='text-black text-base font-normal'>Status: </p>
                                    <p className='text-black text-md font-medium font-serif'>Reserved</p>
                                </div>
                                <div className='flex mt-7 space-x-2 '>
                                    <p className='text-black text-base font-normal'>Duration: </p>
                                    <p className='text-black text-lg font-medium font-serif -mt-1'>
                                    {session?.duration ? formatDuration(session.duration) : 'N/A'}
                                    </p>
                                </div>
                                <div className='flex mt-3 space-x-2'>
                                    <p className='text-black text-base font-normal'>Fees: </p>
                                    <p className='text-primary-orange text-base font-medium'>₹{session?.fee}</p>
                                </div>
                                <div className='flex mt-3 space-x-2 '>
                                    <p className='text-black text-base font-normal'>Date: </p>
                                    <p className='text-black text-md font-medium font-serif'>{formatDate(date)}</p>
                                </div>
                                <div className='flex mt-3 space-x-2 '>
                                    <p className='text-black text-base font-normal'>Time: </p>
                                    <p className='text-black text-md font-medium font-serif'>
                                        {time ? convertTo12HourFormat(time) : 'N/A'}
                                    </p>
                                </div>
                                <div className='flex justify-center mt-7'>
                                    { sessionCancelled ? (
                                        <Link to={"/student/upcoming-sessions"}>
                                            <button 
                                                className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                                <span className="text-black relative z-10 text-xs">Session Cancelled</span>
                                                <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                            </button>
                                        </Link>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                // handleCancelSession(); 
                                                setIsModalOpen(true)
                                            }}
                                            className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                            <span className="text-black relative z-10 text-xs">Cancel Session</span>
                                            <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                        </button>
                                    )}
                                    


                                    
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* session info */}
                    <div className='w-5/12 h-auto bg-white rounded-md shadow-md ml-56 mt-8 pt-10 pl-10 pb-20'>
                        <p className='text-black text-xl font-medium font-serif'>What you’ll learn</p>
                        <div className='pt-4 mt-4'>
                            <div className='flex space-x-4'>
                                <p className='text-black'>1.</p>
                                <p className='text-blue-950 text-base font-semibold'>{session?.descriptionTitle}:</p>
                            </div>
                            <p className='w-8/12 text-gray-600 text-sm ml-8 pr-3 mt-2'>{session?.description}
                            </p>

                            <Link to={`/user/meeting-room/${meetingRoomId}`} className="text-blue-600">
                                <div className='mt-10 px-5 py-3 text-sm bg-blue-600 text-white w-6/12 hover:text-black'>Click here to join the session</div>
                            </Link>
                        </div>
                    </div>



                    {/* Modal */}
                    {isModalOpen && (
                        <Modal
                            title="Confirm Cancellation"
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={() => {
                                setIsModalOpen(false);
                                handleCancelSession();
                            }}
                        >
                            <p>Are you sure you want to cancel this session?</p>
                        </Modal>
                    )}

                </div>
            </div>
        </>
    )
}

export default ReservedSessionInfo;
