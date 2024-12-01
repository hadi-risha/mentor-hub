import awardImg from '../../assets/userImgs/award.png'
import { EmojioneMonotoneRibbon } from '../../assets/usersIcons/SessionIcons'
import { EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import { BiCashStack, MdiClockOutline, OuiTokenDate } from '../../assets/usersIcons/SessionIcons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';

interface ISession {
    id: string;
    title: string;
    introduction: string;
    duration: string;
    fee: number;
    descriptionTitle: string;
    description: string;
    timeSlots: string[];
    sessionimgUrl: string;
    sessionimgKey: string;
    instructorId: string;
    firstName: string;
    lastName: string;
    instructorImg: string;
}

const ISingleSessionDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [session, setSession] = useState<ISession>(); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
          try {
            const response = await axiosInstance.get(`/instructor/session/${id}`); // Adjust the endpoint if needed
            
            console.log("response           2...", response.data);
            console.log("response           title...", response.data.title);
            console.log("response           url...", response.data.sessionimgUrl); 
            console.log("instructorId, firstName, lastName, instructorImg", response.data.instructorId, response.data.firstName, response.data.lastName, response.data.instructorImg);
            
            setSession(response.data); 
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
        fetchSession();
    }, []);

    const formatDuration = (duration: string): string => {
        if (!duration) return 'N/A'; // Handle missing duration
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
        navigate(`/instructor/session-actions`);
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
                                    src={session?.sessionimgUrl}
                                    alt={session?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                                <div className='flex items-center space-x-3'>
                                    <img src={session?.instructorImg} className=' w-12 h-12 object-cover rounded-full' alt="" />    
                                    <p className='text-blue-950'>{session?.firstName} {session?.lastName}</p>
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
                                    <p className='text-primary-orange text-lg font-medium font-serif -mt-1'>₹{session?.fee}</p>
                                </div>

                                <div className='flex mt-3 space-x-2 '>
                                    <p className='text-black text-base font-normal'>Time slots: </p>
                                    <p className='text-black text-md font-medium '>
                                        {formatTimeSlots(session?.timeSlots || [])}
                                    </p>
                                </div>
                                
                                <div className='flex justify-center mt-5'>
                                    {/* <button 
                                        onClick={() => {
                                            if (session?.id) {
                                                handleButtonClick(session.id); // Pass the id only if it's defined
                                            }
                                        }}
                                        className='py-1.5 px-5  bg-primary-orange rounded-full text-xs'>Go back
                                    </button> */}


                                    <button 
                                        onClick={() => {
                                            if (session?.id) {
                                                handleButtonClick(session.id); // Pass the id only if it's defined
                                            }
                                        }}
                                        className="w-40 h-9 bg-[#3ee1a6] text-white font-semibold flex items-center justify-center rounded-full shadow-md border border-black relative overflow-hidden group transition duration-700">
                                        <span className="relative z-10 text-xs">Go back</span>
                                        <span className="absolute inset-0 bg-[#ff5c4c] transition-all duration-600 group-hover:w-full group-hover:left-0 w-0 left-[-100%] h-full"></span>
                                    </button>




                                </div>
                                
                            </div>
                        </div>


                    
                </div>


                {/* session info */}
                <div className='w-5/12 h-auto bg-white rounded-md shadow-md ml-56 mt-8 pt-10 pl-10 pb-24'>
                    <p className='text-black text-lg font-medium font-serif'>What you’ll learn</p>

                    <div className='pt-4 mt-4'>
                        <div className='flex space-x-4'>
                            <p className='text-black'>1.</p>
                            <p className='text-blue-950 text-sm font-semibold'>{session?.descriptionTitle}:</p>
                        </div>
                        <p className='w-8/12 text-gray-600 text-sm ml-8 pr-3'>{session?.description}
                        </p>
                    </div>


                </div>


                    

                

                </div>
            </div>
        </>
    )
}

export default ISingleSessionDetails;
