import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiEducationOutline } from '../../assets/usersIcons/ProfileIcons'
import instructor from '../../assets/instructor.png'
import bg1 from '../../assets/bg-1.jpeg'
import bg2 from '../../assets/userImgs/bg-2.jpeg'
import bg3 from '../../assets/bg-3.jpeg'
import bg4 from '../../assets/bg-4.jpeg'
import bg5 from '../../assets/bg-5.jpeg'
import bg6 from '../../assets/bg-6.jpeg'
import bg7 from '../../assets/bg-7.jpeg'
import bg8 from '../../assets/bg-8.jpeg'
import bg9 from '../../assets/bg-9.jpeg'
import bg10 from '../../assets/bg-10.jpeg'
import bg11 from '../../assets/bg-11.jpeg'
import studentImg from '../../assets/userImgs/student.png'
import { IconParkSolidDownOne, CharmMenuKebab, EmojioneStar, EmojioneMonotoneStar } from '../../assets/usersIcons/HomeIcons';
import { BxCalendar, FluentPeopleTeam48Regular, IcOutlineAccessTime, PhChalkboardTeacher } from '../../assets/usersIcons/SessionIcons'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/users/axiosInstance'
import { useNavigate } from 'react-router-dom'



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
        // let response = await axiosInstance.post('/student/switch-role');
        // const response = await axiosInstance.post('/instructor/delete-session');
        const response = await axiosInstance.delete(`/instructor/delete-session/${id}`);


        console.log("response",response);
        
        
    } catch (error) {
        console.error('Error switching role:', error);
    }

  };

  

  return (
    <>
      <div className='w-screen h-screen bg-slate-200'>


        <div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg'>
            {/* first part */}
            <div className='w-full h-4/6 rounded-tl-lg rounded-tr-lg object-cover bg-center' style={{ backgroundImage: `url(${bg2})` }}>
                
                {/* profile photo section */}
                <div className='flex w-full h-3 pl-10 pt-8'>
                    <img src={studentImg} className='w-20 h-20 object-cover border-2 rounded-full' alt="" />
                    {/* <div className='pl-5 pt-2'>
                        <p className='text-lg text-white font-medium'>Sarah Thompson</p>
                        <p className='text-gray-200'>Instructor</p>
                    </div> */}

                    <div className='flex ml-auto bg-gray-300 w-80 h-16 space-x-6 pl-9 pt-2 rounded-tl-md rounded-bl-md'>
                        <div className='w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center '>
                            <IcSharpPersonAdd />
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
                <div className='mt-28 ml-10 flex'>


                {/* {Sessions.map((session, index) => (
                    <div key={session?._id}>
                        <p>Instructor: {session.instructorId.firstName} {session.instructorId.lastName}</p>
                    </div>
                ))} */}



    



                    {/* <div>
                        <p className='font-semibold text-gray-700'>Susan Jane</p>
                        <p className='font-light text-sm text-gray-700'>Student</p>
                    </div> */}

                    <div className='flex space-x-20 ml-40'>
                        <a href={"/instructor/profile"}>
                            <p className='text-black'>About</p>
                        </a>
                        <div>
                            <p className='text-primary-orange'>Sessions</p>
                            <TeenyiconsUpSolid className='mt-3 ml-3' />
                        </div>

                        {/* <p className='text-black'>Posts</p> */}  
                        <a href={"/instructor/booked-sessions"}>
                            <p className='text-black'>Confirmed Sessions</p>
                        </a>


                        <div className='bg-light-blue w-10 h-10 -mt-2 rounded-full flex items-center justify-center'>
                            <SolarMenuDotsBold />
                        </div>

                    </div>

                    <div className='-mt-2 ml-auto mr-6'>
                        <p className='text-black text-md'>Following Instructors</p>
                        <p className='text-primary-orange text-md ml-16'>20</p>
                    </div>
                </div> 
            </div>   
        </div>


        {/* UPCOMING SESSIONS */}
        <div className='w-10/12 h-96 ml-28 mt-8 py-6  space-x-16 flex bg-white' >





 {/* _id: string;
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
    }; */}
     
        <a href={"/instructor/create-session"}>
            <div>
                <button className="mr-40 bg-blue-200 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 absolute right-0">
                    Create session
                </button>
            </div>
        </a>
            

{/* <div className="flex justify-end">
    <button className="bg-blue-200">Create session</button>
</div> */}


            {loading ? (
                <p>Loading...</p>
            ) : sessions.length > 0 ? (
                sessions.map((session) => (
                <div
                    key={session._id}
                    // className="w-3/12 h-80 ml-20 bg-blue-50 border rounded-md py-4 px-7 space-y-4"
                    className="w-3/12 h-40 ml-20 mt-14 bg-blue-50 border rounded-md py-4 px-7 space-y-4"

                >
                    {/* Session Title */}
                    <p className="text-black font-serif">{session.title}</p>
                    {/* <p className="text-black font-serif">{session._id}</p> */}

                    <div className='flex  space-x-1'>

                        <button 
                            onClick={() => handleUpdate(session._id)} // Call the navigate function
                            className="bg-blue-800 text-sm px-4 py-1  items-center ml-10">
                            Update
                        </button>

                        <button 
                            onClick={() => handleDelete(session._id)}
                            className="bg-red-500 text-sm px-4 py-1  items-center ml-10">
                            Delete
                        </button>

                    </div>
                    

                    
                </div>
                ))
            ) : (
                <p>No sessions available.</p>
            )}
            

        </div>



      </div>
    </>
  )
}

export default Sessions;
