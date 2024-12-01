import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiEducationOutline, TypcnUserAdd, MaterialSymbolsAdd } from '../../assets/usersIcons/ProfileIcons'
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
import { FaUserCircle } from 'react-icons/fa'



interface IBooking {
    _id: string;
    studentId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    sessionId: {
        _id: string;
        title: string;
        duration: string;
        fee: string;
        descriptionTitle: string;
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


const BookedSessions = () => {
    const navigate = useNavigate();  // Initialize navigate function

    const [booking, setBooking] = useState<IBooking[]>([]); 
    const [loading, setLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        role: '',
        firstName: '',
        lastName: '',
        occupation: '',
        currentInstitution: '',
        profilePic: '',
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axiosInstance.get('/instructor/profile');
                console.log("res profile data in update all data------------",res.data);
                console.log("res profile data in update data------------",res.data.message);

                const {
                    role,
                    firstName, 
                    lastName,
                    occupation, 
                    currentInstitution, 
                    profilePicUrl } = res.data;

                setProfileData({
                    role: role || '',
                    firstName: firstName || '',
                    lastName: lastName || '',
                    occupation: occupation || '',
                    currentInstitution: currentInstitution || '',
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
            const response = await axiosInstance.get("/instructor/booked-sessions"); // Adjust the endpoint if needed
            
            // console.log("instructor imageeeeeeeeeee url777777777777999999999999", response.data.session.image.url);

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


      const formatTimeSlot = (timeSlot: string): string => {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const convertedHours = hours % 12 || 12; 
        return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

      // Handle click event to navigate to session details page
  const handleViewDetails = (sessionId: string) => {
    navigate(`/instructor/session/${sessionId}`);
  };
  

  return (
    <>
      <div className='w-screen h-auto bg-white'>


<div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg shadow'>
    {/* first part */}
    <div className='w-full h-32 bg-[#fbcfb1] rounded-tl-lg rounded-tr-lg object-cover bg-center' >
        
        {/* profile photo section */}
        <div className='flex w-full h-3 pl-10 pt-8'>
            {profileData && profileData.profilePic ? (
                <img
                    src={profileData.profilePic} className="w-20 h-20 object-cover rounded-full" alt="Instructor Profile"
                />
            ) : (
                <FaUserCircle className="w-20 h-20 text-white" />
            )}

            <div className='pl-5 pt-2'>
                <p className='text-lg text-black font-medium font-serif'>{profileData.firstName} {profileData.lastName}</p>
                <p className='text-gray-600'>{profileData.role}</p>
            </div>

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
        <div className='mt-28 ml-10 h-auto flex'>
            <div>
                {profileData.occupation && 
                    <p className='font-semibold text-gray-700'>Position: 
                        <span className='font-normal text-gray-700'> {profileData.occupation}</span>
                    </p>
                }
                {profileData.currentInstitution && 
                    <p className='font-semibold text-gray-700'>Institution: 
                        <span className='font-normal text-gray-700'> {profileData.currentInstitution}</span>
                    </p>
                }
            </div>


                    <div className='flex space-x-20 ml-40'>
                        <a href={"/instructor/profile"}>
                            <p className='text-black font-serif text-lg'>About</p>
                        </a>
                        <a href={"/instructor/session-actions"}>
                            <p className='text-black font-serif text-lg'>Session Actions</p>
                        </a>
                        <div>
                            <p className='text-primary-orange '>Confirmed Sessions</p>
                            <TeenyiconsUpSolid className='mt-3 ml-16' />
                        </div>
                    </div>

                    <div className="ml-auto mr-6 relative group">
                        <a href="/instructor/create-session">
                            <div className="bg-[#f6f6f6] w-10 h-10 -mt-2 rounded-full flex items-center justify-center hover:border hover:border-black">
                                <MaterialSymbolsAdd />
                            </div>
                        </a>
                        {/* Tooltip for text */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Create
                        </div>
                    </div>
                </div> 
            </div>   
        </div>


        {/* UPCOMING SESSIONS */}
        <div className="ml-28 mr-36 mt-8 mb-36 h-auto py-16 px-14 shadow-2xl grid grid-cols-4 gap-3">

            {loading ? (
                <p>Loading...</p>
            ) : booking.length > 0 ? (
                booking.map((session) => (
                <div
                    key={session._id}
                    // className="w-3/12 h-80 ml-20 bg-blue-50 border rounded-md py-4 px-7 space-y-4"
                    className='px-10 py-10 relative w-[280px] h-[350px] rounded-2xl border-2 border-black'
                >
                    {/* Session Title */}
                    <p className="text-black font-serif">{session.sessionId.title}</p>

                    {/* Instructor Name */}
                    <div className="flex space-x-3 pt-10">
                        <PhChalkboardTeacher />
                        <p className="text-gray-600 text-sm"> Student:
                            {session.studentId.firstName} {session.studentId.lastName}
                        </p>
                    </div>
                    <hr className="mt-3 border border-gray-300" />

                    {/* Time Slot */}
                    <div className="mt-5 flex space-x-3">
                        <IcOutlineAccessTime />
                        <p className="text-gray-600 text-sm">{formatTimeSlot(session?.timeSlot || '00:00')}</p>
                    </div>
                    <hr className="mt-3 border border-gray-300" />

                    <div className="mt-5 flex space-x-3">
                        <BxCalendar />
                        <p className="text-gray-600 text-sm">{formatDate(session.date)}</p>
                    </div>

                    {/* View Details Button */}
                    <button 
                        onClick={() => handleViewDetails(session.sessionId._id)} // Call the navigate function
                        className="mt-5 bg-blue-800 text-sm px-4 py-1 rounded-2xl items-center ml-10">
                    View Details
                    </button>
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

export default BookedSessions;
