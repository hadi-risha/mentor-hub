import { IconParkSolidDownOne, CharmMenuKebab, EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import jsCourse from "../../assets/userImgs/jsCourse.png";
import { useDispatch } from 'react-redux';
import  {logout}  from '../../slices/loginSlice';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';


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

const InstructorHome = () => {


  const dispatch = useDispatch(); // Initialize useDispatch

  const [sessions, setSessions] = useState<ISession[]>([]); // Typed state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await axiosInstance.get('/instructor/sessions'); // Adjust the endpoint if needed
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

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <div className='bg-gray-200 mt-0'>
      <div className="bg-white w-12/12 h-16 ml-5 mt-4 mr-5 rounded-md">
        <div className="flex space-x-12 ml-7 pt-6 text-lg">
          <p className="text-black font-medium">Technology & Programming</p>
          <p className="text-gray-500 font-medium">Business & Management</p>
          <p className="text-gray-500 font-medium">Marketing & Digital Media</p>
          <p className="text-gray-500 font-medium">Business Analytics & Intelligence</p>
          {/* <p className="text-gray-500 font-medium">Language Learning</p> */}

          <div className="relative inline-block w-36 -mt-1">
            <select className="text-sm w-full appearance-none bg-light-blue border border-gray-300 rounded-sm px-1 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <option value="" className="text-sm">Filter by</option>
              <option value="technology" className="text-sm">Technology & Programming</option>
              <option value="business" className="text-sm">Business & Management</option>
              <option value="creative" className="text-sm">Creative Arts & Design</option>
              <option value="personal" className="text-sm">Personal Development</option>
            </select>
            <IconParkSolidDownOne className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
          <CharmMenuKebab />
        </div>
      </div>

    <div className='bg-sky-blue w-12/12 h-screen ml-6 mr-5'>
      <div className="flex space-x-7 mt-10  pt-5 rounded-md">
        <div className='bg-black w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-white font-medium'>Web Development</p>
          <p className='text-white font-light text-xs'>100+ Learners</p>
        </div>
        <div className='bg-white w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-black font-bold'>JavaScript</p>
          <p className='text-gray-700 font-light text-xs'>100+ Learners</p>
        </div>
        <div className='bg-white w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-black font-bold'>React JS</p>
          <p className='text-gray-700 font-light text-xs'>100+ Learners</p>
        </div>
        <div className='bg-white w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-black font-bold'>Angular</p>
          <p className='text-gray-700 font-light text-xs'>100+ Learners</p>
        </div>
        <div className='bg-white w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-black font-bold'>Android Development</p>
          <p className='text-gray-700 font-light text-xs'>100+ Learners</p>
        </div>
        <div className='bg-white w-48 h-14 ml-12 rounded-full flex flex-col justify-center items-center'>
          <p className='text-black font-bold'>Android Development</p>
          <p className='text-gray-700 font-light text-xs'>100+ Learners</p>
        </div>
      </div>


      {/* session cards */} 
      <div className="flex space-x-14 mt-10  pt-5 rounded-md">


        {/* <div className='bg-white w-1/5 h-96 ml-14 rounded-md flex flex-col justify-center items-center border-2 border-gray-500'>
          <div className='bg-white w-full h-1/2 border-2 border-gray-500 rounded-tl-md rounded-tr-md'>
            <img src={jsCourse} alt="My Local" className="w-full h-full object-cover" />
          </div>

          <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
            <p className='text-black font-bold text-lg'>Learn TypeScript</p>
            <p className='text-gray-400 text-md mt-3'>Dr: susmitha_jane</p>
            <p className='text-black text-lg font-medium font-serif mt-3'>₹1,000</p>
            <div className='flex space-x-3 mt-5'>
              <p className='text-black text-xs'>Instrucror overall rating:</p>
              <div className='flex space-x-1 '>
                <EmojioneStar />
                <EmojioneStar />
                <EmojioneStar />
                <EmojioneStar />
                <EmojioneMonotoneStar />

              </div>
            </div>
            
          </div>
        </div>  */}



        <div className="bg-sky-blue w-12/12 h-screen ml-14 mr-5 -mt-10 w-11/12">
          {loading ? (
            <div className="text-center mt-10">Loading sessions...</div>
          ) : (
            <div className="grid grid-cols-4 gap-8 mt-10">
              {sessions.map((session) => {
                console.log("insideeeeeeeeeeee", session);
                console.log(session.title); 

                return (
                  <div
                    key={session._id}
                    className="bg-white w-full h-auto rounded-md flex flex-col border-2 border-gray-500 cursor-pointer"
                    // onClick={() => handleCardClick(session._id)}
                  >
                    <div className="bg-white w-full h-40 border-b-2 border-gray-500 rounded-tl-md rounded-tr-md">
                      <img
                        src={session.coverImage.url}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 bg-white w-full">
                      <p className="text-black font-bold text-lg">{session.title}</p>
                      {/* <p className="text-gray-400 text-md mt-3">Dr: susmitha_jane</p> */}
                      <p className="text-gray-400 text-md mt-3">Dr: {session.instructorId.firstName} {session.instructorId.lastName}</p>
                      <p className="text-black text-lg font-medium font-serif mt-3">
                        ₹{session.fee}
                      </p>
                      
                      {/* stars collection here */}
                      <div className='flex space-x-3 mt-5'>
                        <p className='text-black text-xs'>Instrucror overall rating:</p>
                        <div className='flex space-x-1 '>
                          <EmojioneStar />
                          <EmojioneStar />
                          <EmojioneStar />
                          <EmojioneStar />
                          <EmojioneMonotoneStar />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>



      </div>



    </div>

    {/* Sample Logout Button */}
    {/* <div className="flex justify-center mt-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div> */}




      
    </div>
  )
}

export default InstructorHome;
