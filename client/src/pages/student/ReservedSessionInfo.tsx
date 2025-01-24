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
    const isCallEnded = localStorage.getItem("isCallEnded");

    const navigate = useNavigate();
    const { id } = useParams();
    console.log("id--------", id);
    

    const { state } = useLocation(); // access state from navigation
    const { bookingId, date, time, meetingRoomId } = state || {};
    console.log("bookingId, date, time, meetingRoomId----------", bookingId, date, time, meetingRoomId);

    console.log("bookingId==", bookingId);
    
     

    

    const [session, setSession] = useState<ISession>();
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionCancelled, setSessionCancelled] = useState(false);


    const [isRatingModalOpen, setRatingModalOpen] = useState(false); // To manage modal visibility
    const [rating, setRating] = useState('');

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


    const handleRating = (ratingValue: string) => {

        console.log("ratingValue--------------------------", ratingValue);
        
        setRating(ratingValue); // Set the selected rating
        // setRatingModalOpen(false); // Close the modal after selection
        console.log(`Instructor rated as: ${ratingValue}`);
    };


    

    const handleStatusAndRating = async () => {
        console.log("submittttttttttttttttttt", rating);

        if (!rating) {
            console.error('No rating selected');
            alert('No rating selected')
            return;
        }
        // setRatingModalOpen(false)

        console.log("submittttttttttttttttttt", rating);
        
        try {
            const data = {
                bookingId: bookingId,
                sessionId: id,
                rating: rating, // You can modify this as needed
                feedback: '', // You can modify this as needed
            };

            console.log("Data sent to API:", data);


            // Send data to update session completion
            const updatedStatusandRating = await axiosInstance.post('/student/session-complete/rating', data);
            console.log("updatedStatusandRating", updatedStatusandRating);
            

            if (updatedStatusandRating.status === 200 || updatedStatusandRating.status === 201) {
                // Handle success if needed
                console.log("Session status and rating updated successfully");
            } else {
                console.error('Error updating session completion and rating');
            }
        } catch (error) {
            console.error('Error updating session status or rating:', error);
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
                            {
                                localStorage.getItem("isCallEnded") === 'false'  && (
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
                                )
                            }
                            
                            {
                                localStorage.getItem("isCallEnded") === 'true' && (
                                    <button 
                                    onClick={() => setRatingModalOpen(true)} // Open modal on button click
                                    className="mt-3 w-auto px-4 h-9 bg-white text-black font-semibold flex items-center justify-center shadow-md border border-black">
                                    <EmojioneStar /> <EmojioneStar /> Rate Instructor <EmojioneStar /> <EmojioneStar />
                                    </button>
                                )
                            }
                            
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
                                    {/* Case 1: If session is cancelled */}
                                    {sessionCancelled ? (
                                        <Link to={"/student/upcoming-sessions"}>
                                            <button 
                                                className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                                <span className="text-black relative z-10 text-xs">Session Cancelled</span>
                                                <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                            </button>
                                        </Link>
                                    ) : (
                                        // Case 2: If the call has ended (check localStorage)
                                        localStorage.getItem("isCallEnded") === 'true' ? (
                                            // Do nothing, so no button is rendered when the call has ended
                                            null
                                        ) : (
                                            // Case 3: Default case when the button to cancel session is shown
                                            <button 
                                                onClick={() => {
                                                    // handleCancelSession(); 
                                                    setIsModalOpen(true);
                                                }}
                                                className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                                <span className="text-black relative z-10 text-xs">Cancel Session</span>
                                                <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                            </button>
                                        )
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

                            <Link 
                            className="text-blue-600"
                            // to={`/user/meeting-room/${meetingRoomId}`} 
                            to={`/user/meeting-room/${meetingRoomId}?bookingId=${bookingId}&sessionId=${id}`} 
                            //bookiid as query param
                            >
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


                    {isRatingModalOpen && (
                        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                            <div className="bg-white p-14 rounded-lg shadow-lg space-y-8">
                                <h2 className="text-xl mb-4 text-black font-bold">Rate the Instructor</h2>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleRating('poor')}
                                        className={`w-20 h-9 bg-[#ff5c4c] text-white rounded-full ${
                                            rating === 'poor' ? 'border-2 border-black' : ''
                                        }`}>
                                        Poor
                                    </button>

                                    <button
                                        onClick={() => handleRating('good')}
                                        className={`w-20 h-9 bg-[#ffdb4c] text-white rounded-full ${
                                            rating === 'good' ? 'border-2 border-black' : ''
                                        }`}>
                                        Good
                                    </button>

                                    <button
                                        onClick={() => handleRating('excellent')}
                                        className={`w-20 h-9 bg-[#3ee1a6] text-white rounded-full ${
                                            rating === 'excellent' ? 'border-2 border-black' : ''
                                        }`}>
                                        Excellent
                                    </button>
                                </div>

                                <button
                                    onClick={() => setRatingModalOpen(false)} // Close modal
                                    className="ml-3 mt-4 w-5/12 py-2 text-black border border-black  text-center ">
                                    Close
                                </button>

                                <button 
                                    onClick={handleStatusAndRating} 
                                    className="ml-4 text-black submit-rating mt-4 w-5/12  py-2 border border-black  text-center">
                                    Submit
                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default ReservedSessionInfo;
