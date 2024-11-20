import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, 
    FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, 
    IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiHexagonMultiple, 
    GameIconsAchievement, MdiEducationOutline, TdesignStarFilled, 
    FluentEdit28Filled} from '../../assets/usersIcons/ProfileIcons'
import instructor from '../../assets/userImgs/instructor.png';
import bg4 from '../../assets/userImgs/bg-4.jpeg';


import awardImg from '../../assets/userImgs/award.png'
import { GameIconsBowTieRibbon, EmojioneMonotoneRibbon } from '../../assets/usersIcons/SessionIcons'
import { EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import htmlCourse from "../../assets/userImgs/htmlCourse.png";
import { BiCashStack, MdiClockOutline, OuiTokenDate } from '../../assets/usersIcons/SessionIcons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';



interface ISession {
    _id: string;
    title: string;
    introduction: string;
    fee: number;
    // instructorId: string;
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



const ISingleSessionDetails = () => {
    const navigate = useNavigate();


    const { id } = useParams();

    


    const [session, setSession] = useState<ISession>(); // Typed state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
          try {
            const response = await axiosInstance.get(`/instructor/session/${id}`); // Adjust the endpoint if needed
            console.log("Time slots data from API:", response.data.session.timeSlots);
            console.log("Formatted time slots (12-hour):", formatTimeSlots(response.data.session.timeSlots));

            
            console.log("response           1", response);
            console.log("response           2", response.data.session);
      
            console.log("response           2", response.data.session);
            
            setSession(response.data.session); // Store the sessions data
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
      
        console.log("sessions------------------55", session);
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
    // Convert time slots to 12-hour format
    const convertTo12HourFormat = (time24: string): string => {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const convertedHours = hours % 12 || 12; // Convert to 12-hour format
        return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Format each time slot
    const formattedTimeSlots = timeSlots.map(convertTo12HourFormat);

    // If the number of formatted slots exceeds the limit, truncate and add ellipsis
    const truncatedTimeSlots = formattedTimeSlots.slice(0, limit);

    if (formattedTimeSlots.length > limit) {
        truncatedTimeSlots.push('...'); // Add ellipsis if there are more slots
    }

    // Join the slots with a comma and space
    return truncatedTimeSlots.join(', ');
};


const handleButtonClick = (id: string) => {
    // navigate(`/student/session`, { state: { sessionId: id } });
    navigate(`/instructor/sessions`);
};
  

  return (
    <>
      <div className='w-screen h-screen bg-slate-200'>

        <div className='bg-black w-full h-48 pt-6 flex pl-28'>

            <div className=' '>
                <img src={ awardImg } alt="best mentor" className='border-4 border-yellow-400 w-14 h-14 rounded-full' />
                <EmojioneMonotoneRibbon className="-mt-1 ml-1" />
            </div>

            <div className='ml-14 w-5/12'>
                <h1 className='text-xl text-white font-bold'>{session?.title}</h1>
                <p className='mt-6 '>{session?.introduction}</p>
            
                <div className='flex space-x-3 mt-5'>
                    <p className='text-sm'>Instrucror overall rating:</p>
                    {/* stars collection here */}
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
            <div className='ml-44 bg-white w-3/12 h-[535px] flex flex-col justify-center items-center border-2 border-gray-500'>
                <div className='-mt-14 bg-white w-full h-2/5 border-2 border-gray-500 rounded-tl-md rounded-tr-md'>
                    <img
                        src={session?.coverImage.url}
                        alt={session?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                

                <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                    <div className='flex items-center space-x-3'>
                        <img src={instructor} className=' w-12 h-12 object-cover rounded-full' alt="" />    
                        <p className='text-blue-950'>@{session?.instructorId.firstName} {session?.instructorId.lastName}</p>
                    </div>

                    
                    

                    <div className='flex mt-7 space-x-2 '>
                        <MdiClockOutline />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>
                        {session?.duration ? formatDuration(session.duration) : 'N/A'}
                        </p>
                    </div>

                    <div className='flex mt-3 space-x-2'>
                        <BiCashStack />
                        <p className='text-primary-orange text-lg font-medium font-serif -mt-1'>₹{session?.fee}</p>
                    </div>

                    <div className='flex mt-3 space-x-2 '>
                        <OuiTokenDate className='-ml-2' />
                        {/* <p className='text-black text-md font-medium '>2:00pm - 2:45pm, Tuesday, Sep
                        24, 2024</p> */}
                        <p className='text-black text-md font-medium '>
                            {formatTimeSlots(session?.timeSlots || [])}
                        </p>
                    </div>
                    
                    <div className='flex justify-center mt-5'>
                        <button 
                            onClick={() => {
                                if (session?._id) {
                                    handleButtonClick(session._id); // Pass the id only if it's defined
                                }
                            }}
                            className='py-1.5 px-5  bg-primary-orange rounded-full text-xs'>Go back
                        </button>
                    </div>
                    
                </div>
            </div>


              
        </div>


        {/* session info */}
        <div className='w-5/12 h-auto bg-white rounded-md shadow-md ml-56 mt-8 pt-10 pl-10 pb-24'>
            <p className='text-black text-lg font-medium'>What you’ll learn</p>

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
    </>
  )
}

export default ISingleSessionDetails;
