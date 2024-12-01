import { PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, TypcnUserAdd } from '../../assets/usersIcons/ProfileIcons'
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';



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

}


const UpcomingSessions = () => {
    const navigate = useNavigate();  // Initialize navigate function



    const [booking, setBooking] = useState<IBooking[]>([]); // Typed state

    const [profileData, setProfileData] = useState({
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        profilePic: '',
      });


  const [loading, setLoading] = useState(true);




  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get('/student/profile');

        console.log("res profile data in update all data------------",res.data);
        console.log("res profile data in update all profile------------",res.data.email);
        console.log("res profile data in update data------------",res.data.message);


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
            const response = await axiosInstance.get("/student/booked-sessions"); // Adjust the endpoint if needed
            
            console.log("instructor imageeeeeeeeeee url777777777777999999999999", response);

            // const sessions = Object.values(response.data).filter(
            //     (item) => typeof item === "object"
            //   );


            const sessions = Object.values(response.data).filter(
            (item): item is IBooking => typeof item === "object" && item !== null && "_id" in item
            );
        
              console.log("Parsed Sessions:", sessions);
            

            
            console.log("response           1", response);
            console.log("response.data:      2", response.data);
            console.log("response           3", response.data.booking);
            console.log("response           3", response.data.instructorId);
            console.log("response           3", response.data.instructorId);



            // session?.instructorId?.image?.key
      
            console.log("response           2", response.data.session);
            
            setBooking(sessions); // Store the booking data
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch session:', error);
            setLoading(false);
          }
        };
      
        console.log("booking------------------55", booking);
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
    const handleViewDetails = (bookingId: string, sessionId: string, date: string, time: string) => {
        navigate(`/student/reserved-session/${sessionId}`, {
            state: {
                bookingId,
                date,
                time,
            },
        });
    };
  

  return (
    <>
      <div className='w-screen h-auto bg-white overflow-x-hidden'>


        <div className='bg-white w-10/12 h-48  ml-32 mt-5  rounded-tl-lg rounded-tr-lg shadow'>
            {/* first part */}
            <div className='w-full h-32 bg-[#fbcfb1] rounded-tl-lg rounded-tr-lg object-cover bg-center'>
                
                {/* profile photo section */}
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

                {/* options section */}
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
                        <p className='text-lg font-serif text-black'>Posts</p>
                    </div>

                    <div className='ml-auto mr-6'>
                        {/* <p className='text-black text-md font-serif'>Following Instructors</p>
                        <p className='text-primary-orange text-md ml-16 font-serif'>20</p> */}
                        <div className='bg-[#f6f6f6] w-10 h-10 -mt-2 rounded-full flex items-center justify-center hover:border hover:border-black'>
                            <SolarMenuDotsBold />
                        </div>
                    </div>
                </div> 
            </div>   
        </div>



        {/* UPCOMING SESSION CARDS */}
        {/* <div className='ml-28 mt-8 mr-36 mb-36 h-auto py-16 px-5 flex space-x-12 shadow-md' > */}
        <div className="ml-32 mr-32 mt-8 mb-36 h-auto py-16 px-7 shadow-md grid grid-cols-3 gap-6">
            {loading ? (
                <p>Loading...</p>
            ) : booking.length > 0 ? (
                booking.map((session) => (
                    <div key={session._id} className='relative w-[380px] h-[460px] rounded-2xl border-2 border-black'>
                        <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div> {/* Black overlay */}
                        <div className='w-full h-full rounded-2xl' style={{ backgroundImage: `url(${session.sessionId.coverImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className='absolute bottom-0 left-0 w-full  bg-opacity-60 py-4 px-7 text-white rounded-b-2xl'>
                            <h3 className='mb-3 text-2xl font-bold font-serif'>{session.sessionId?.title}</h3>
                            <p className='text-lg mb-5'>Mentor: {session.instructorId.firstName} {session.instructorId.lastName}</p>
                            <p className='text-lg mb-5'>Date: {formatDate(session.date)}</p>
                            <p className='text-lg mb-5'>Time: {session.timeSlot}</p>
                            
                            {/* View Details Button */}
                            {/* <button 
                                onClick={() => handleViewDetails(session._id, session.sessionId._id, session.date, session.timeSlot)}
                                className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] text-black rounded-full hover:bg-[#2cc58a] transition duration-300 transform hover:scale-105 active:scale-95'>
                                View Details
                            </button> */}
                            { session.status === 'cancelled' ? (
                                <div 
                                    className='mt-2 mb-7 w-7/12 py-1 px-5 bg-red-500 text-black rounded-full'>
                                    Session Cancelled
                                </div>

                            ) : (
                                <button 
                                    onClick={() => handleViewDetails(session._id, session.sessionId._id, session.date, session.timeSlot)}
                                    className='mt-2 mb-7 py-1 px-4 bg-[#f4c857] text-black rounded-full hover:bg-[#2cc58a] transition duration-300 transform hover:scale-105 active:scale-95'>
                                    View Details
                                </button> 
                            )}



                            {/* <p className='bg-red-500'>{session.status}</p> */}
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

export default UpcomingSessions;
