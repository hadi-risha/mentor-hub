import { IconParkSolidDownOne, CharmMenuKebab, EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import jsCourse from "../../assets/userImgs/jsCourse.png";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import  {logout}  from '../../slices/loginSlice';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';



interface ISession {
  _id: string;
  title: string;
  introduction: string;
  fee: number;
  // instructorId: string;
  duration: string;
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

const AllSessions = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch(); // Initialize useDispatch

  const [sessions, setSessions] = useState<ISession[]>([]); // Typed state
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  async function fetchSessions() {
    try {
      const response = await axiosInstance.get('/student/sessions'); // Adjust the endpoint if needed
      console.log("response           1", response);
      console.log("response           2", response.data.sessions);

      console.log("response           2", response.data.sessions);
      
      setSessions(response.data.sessions); // Store the sessions data
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setLoading(false);
    }
  };

  console.log("sessions------------------55", sessions);
  fetchSessions();
  }, []);

  console.log("sessions------------------10", sessions);


  const handleCardClick = (id: string) => {
    // navigate(`/student/session`, { state: { sessionId: id } });
    navigate(`/student/session/${id}`);
  };
  

  return (
    <div className='pl-12 bg-white mt-0'>
      
        <p className='ml-28 mt-14 text-black text-2xl font-serif'>Explore Available Sessions</p>


        <div className="ml-28 mr-36 mt-8 mb-36 h-auto py-16 px-5 shadow-xl grid grid-cols-3 gap-6">
            {loading ? (
                <p>Loading...</p>
            ) : sessions.length > 0 ? (
                sessions.map((session) => (
                    <div key={session._id} className='relative w-[380px] h-[460px] rounded-2xl border-2 border-black'>
                        <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div> {/* Black overlay */}
                        <div className='w-full h-full rounded-2xl' style={{ backgroundImage: `url(${session.coverImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className='absolute bottom-0 left-0 w-full  bg-opacity-60 py-4 px-7 text-white rounded-b-2xl'>
                            <h3 className='mb-3 text-2xl font-bold font-serif'>{session.title}</h3>
                            <p className='text-lg mb-5'>Mentor: {session.instructorId.firstName} {session.instructorId.lastName}</p>
                            <p className='text-lg mb-5'>Fees: ₹{session.fee}</p>
                            {/* <p className='text-lg mb-5'>Time: {session.timeSlot}</p> */}
                            
                            {/* View Details Button */}
                            <button 
                                onClick={() => handleCardClick(session._id)}
                                className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] text-black rounded-full hover:bg-[#2cc58a] transition duration-300 transform hover:scale-105 active:scale-95'>
                                View Details
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No upcoming sessions available.</p>
            )}
        </div>



    </div>
  )
}

export default AllSessions
