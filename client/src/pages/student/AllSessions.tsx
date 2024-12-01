import  { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';

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
    url: string;
    key: string;
  };
  instructorId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

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
      firstName: string;
      lastName: string;
  };
  date: string;
  timeSlot: string;
  status: string;
}

const AllSessions = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<ISession[]>([]); // Typed state
  const [loading, setLoading] = useState(true);

  const [bookings, setBooking] = useState<IBooking[]>([]); // Typed state


  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await axiosInstance.get("/student/sessions");
        console.log("Response data:", response.data);
  
        const sessions = response.data.sessions || []; // Directly access sessions array
  
        if (!Array.isArray(sessions)) {
          console.error('Unexpected sessions format:', response.data);
          setLoading(false);
          return;
        }
  
        console.log("Parsed Sessions:", sessions);
        setSessions(sessions); // Update state with session data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setLoading(false);
      }
    }
  
    fetchSessions();
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axiosInstance.get("/student/booked-sessions"); // Adjust the endpoint if needed
        
        console.log("instructor imageeeeeeeeeee url777777777777999999999999", response);

        const bookings = Object.values(response.data).filter(
        (item): item is IBooking => typeof item === 'object' && item !== null && '_id' in item

        );
    
        console.log("Parsed Sessions:", bookings);
        

        
        console.log("response           1", response);
        console.log("response.data:      2", response.data);
        console.log("response           3", response.data.booking);
        console.log("response           3", response.data.instructorId);
        console.log("response           3", response.data.instructorId);
        
        setBooking(bookings); // Store the booking data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setLoading(false);
      }
    };
  
    console.log("bookings------------------55", bookings);
    fetchBookings();
}, []);

  // Get booked session IDs
  const bookedSessionIds = bookings.map((booking) => booking.sessionId._id);


    // Filter non-booked sessions
    const nonBookedSessions = sessions.filter(
      (session) => !bookedSessionIds.includes(session._id)
    );

    




      // Handle click event to navigate to session details page
  const handleViewDetails = (sessionId: string) => {
    navigate(`/student/session/${sessionId}`);
  };






  

  return (
    <>
      <div className='w-screen h-auto bg-white'>
      {/* <p className='ml-28 mt-14 text-black text-2xl font-serif'>Explore Available Sessions</p> */}


        {/* ALL SESSIONS */}
        <div className="ml-28 mr-36 mt-8 mb-36 h-auto py-16 px-5 shadow-2xl grid grid-cols-3 gap-6">
            {loading ? (
                <p>Loading...</p>
            ) : nonBookedSessions.length > 0 ? (
                nonBookedSessions.map((session) => (
            
                    <div key={session._id} className='relative w-[380px] h-[460px] rounded-2xl border-2 border-black'>
                        <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div> {/* Black overlay */}
                        <div className='w-full h-full rounded-2xl' style={{ backgroundImage: `url(${session.coverImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className='absolute bottom-0 left-0 w-full  bg-opacity-60 py-4 px-7 text-white rounded-b-2xl'>
                            <h3 className='mb-3 text-2xl font-bold font-serif'>{session.title}</h3>
                            <p className='text-lg mb-5'>Fees: ₹{session.fee}</p>
                            <button 
                                onClick={() => handleViewDetails(session._id)} 
                                className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] border-2 border-white text-black rounded-full hover:bg-[#2cc58a]  transition duration-300 transform hover:scale-105 active:scale-95'>
                                view Details
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No upcoming sessions available.</p>
            )}
        </div>

      </div>
    </>
  )
}

export default AllSessions;