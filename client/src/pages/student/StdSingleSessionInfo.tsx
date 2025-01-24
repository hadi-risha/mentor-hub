import instructor from '../../assets/userImgs/instructor.png';
import { EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

interface ISession {
    _id: string;
    title: string;
    introduction: string;
    fee: number;
    duration: string;
    timeSlots: string[];
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


const SingleSessionInfo = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [session, setSession] = useState<ISession>(); 
    const [loading, setLoading] = useState(true);
    const [wishlistStatus, setWishlistStatus] = useState(false);

    useEffect(() => {
        async function fetchSession() {
          try {
            const response = await axiosInstance.get(`/student/session/${id}`); 
            setSession(response.data.session); // Store the sessions data
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
        fetchSession();
    }, []);
    console.log("sessions------------------55", session);

    const formatDuration = (duration: string): string => {
        if (!duration) return 'N/A'; 
        const [hours = 0, minutes = 0] = duration.split(':').map(Number);
        const hourText = hours ? `${hours} hr` : '';
        const minuteText = minutes ? `${minutes} min` : '';
        return [hourText, minuteText].filter(Boolean).join(' ');
    };

    const formatTimeSlots = (timeSlots: string[], limit: number = 4): string => {
        const convertTo12HourFormat = (time24: string): string => {
            const [hours, minutes] = time24.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const convertedHours = hours % 12 || 12; 
            return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        };
        const formattedTimeSlots = timeSlots.map(convertTo12HourFormat);
        const truncatedTimeSlots = formattedTimeSlots.slice(0, limit);

        if (formattedTimeSlots.length > limit) {
            truncatedTimeSlots.push('...'); 
        }
        return truncatedTimeSlots.join(', ');
    };

    const handleButtonClick = (id: string) => {
        navigate(`/student/book-session/${id}`);
    };



    useEffect(() => {
        async function isSessionInWishlist() {
          try {
            const response = await axiosInstance.post(`/student/wishlist/check}`, {sessionId : id}); 

            console.log("response, checking session is in wishlist or not", response.data.wishlist);
            
            setWishlistStatus(response.data.wishlist.isInWislist)
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch wishlist status:', error);
            setLoading(false);
          }
        };
        isSessionInWishlist();
    }, []);


    const patchWishlist = async () => {

        try {
        const response = await axiosInstance.patch(
            `/student/wishlist`, {sessionId: id}
        );
        console.log("Response data: wishlist", response.data.isInWishlist);
        
        const message = response?.data?.message;
        console.log("patch likes Parsed posts:", message);

        setWishlistStatus(response.data.isInWishlist)
        setLoading(false);
        } catch (error) {
        console.error("Failed to update wishlist:", error);
        setLoading(false);
        }
    };
  

    return (
        <>
            <div className='mx-32 py-14 w-screen h-screen bg-[white]'>
                <div className='h-full bg-[#f6f6f6] rounded-2xl'>

                    
                        <div className='bg-[#40ab84] rounded-t-2xl w-full h-48 pt-6 flex pl-28 shadow'>

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
                            <div className='ml-44 bg-white w-3/12 h-[535px] flex flex-col justify-center items-center border-2 border-gray-300'>
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

                                    <div className='flex mt-7 space-x-2 '>
                                        {/* <MdiClockOutline /> */}
                                        <p className='text-black text-base font-normal'>Duration: </p>
                                        <p className='text-black text-lg font-medium font-serif -mt-1'>
                                        {session?.duration ? formatDuration(session.duration) : 'N/A'}
                                        </p>
                                    </div>

                                    <div className='flex mt-3 space-x-2'>
                                        {/* <BiCashStack /> */}
                                        <p className='text-black text-base font-normal'>Fees: </p>
                                        <p className='text-primary-orange text-base font-medium'>₹{session?.fee}</p>
                                    </div>

                                    <div className='flex mt-3 space-x-2 '>
                                        {/* <OuiTokenDate className='-ml-2' /> */}
                                        <p className='text-black text-base font-normal'>Time slots: </p>
                                        <p className='text-black text-md font-medium font-serif'>
                                            {formatTimeSlots(session?.timeSlots || [])}
                                        </p>
                                    </div>
                                    
                                    <div className='flex justify-center mt-10'>
                                        <button 
                                            onClick={() => {
                                                if (session?._id) {
                                                    handleButtonClick(session._id); // Pass the id only if it's defined
                                                }
                                            }}
                                            className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                            <span className="relative z-10 text-xs">Reserve Your session</span>
                                            <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                        </button>
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
                            </div>

                            {/* <div className="flex justify-center items-center mt-10 p-5 w-[200px] font-bold text-rose-600 border border-rose-600 border-dotted">
                                Add to wishlist
                            </div> */}

                            <div className="flex justify-center items-center mt-10 p-5 w-[200px] font-bold text-rose-600 border border-rose-600 border-dotted">
                                {wishlistStatus ? (
                                    <div onClick={patchWishlist} className="cursor-pointer">
                                        Added to wishlist
                                    </div>
                                ) : (
                                    <div onClick={patchWishlist} className="cursor-pointer">
                                    Add to wishlist
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

            </div>
        </>
    )
}

export default SingleSessionInfo;
