import { BiCashStack, MdiClockOutline } from '../../assets/usersIcons/SessionIcons';
import {  BitcoinIconsArrowLeftFilledBlack, UiwLeft, UiwRight } from '../../assets/usersIcons/ProfileIcon';
import { generateCalendar } from '../../utils/users/generateCalendar';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    image: {
      url: string;
      key: string;
    };
  };
}


const StudentBookSession = () => {



  const navigate = useNavigate();

    // const location = useLocation();

    // const sessionId = location.state?.sessionId; // Retrieve the session ID
    const { sessionId } = useParams();



    const [session, setSession] = useState<ISession>(); // Typed state
    const [loading, setLoading] = useState(true);

    const [selectedSessionDate, setSelectedSessionDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);


    useEffect(() => {
        async function fetchSession() {
          try {
            const response = await axiosInstance.get(`/student/session/${sessionId}`); // Adjust the endpoint if needed
            console.log("Time slots data from API:", response.data.session);
            // console.log("instructor imageeeeeeeeeee url777777777777999999999999", response.data.session.image.url);
            

            
            console.log("response           1", response);
            console.log("response           2", response.data.session);



            // session?.instructorId?.image?.key
      
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











  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(nextMonth);
  };
  
  const formattedMonthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });



  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust "0" hour to "12"
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    
    return formattedTime;
  };

  // Sort timeSlots in ascending order
  const sortedTimeSlots = session?.timeSlots.sort((a, b) => {
    const [aHour, aMinute] = a.split(':').map(Number);
    const [bHour, bMinute] = b.split(':').map(Number);

    const dateA = new Date();
    const dateB = new Date();
    dateA.setHours(aHour, aMinute);
    dateB.setHours(bHour, bMinute);

    return dateA.getTime() - dateB.getTime(); // Compare timestamps
  }) || [];





 

  if (loading) return <div>Loading...</div>;


  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected Date:", date); // Handle the selected date (for example, send to API)
  };

const handleTimeSlotSelection = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);  // Update the selected time slot
};


// const handleButtonClick = (id: string) => {
//   // navigate(`/student/session`, { state: { sessionId: id } });
//   navigate(`/student/session-payment/${id}`);
// };


const handleNextButtonClick = () => {
  // Check if the selected date is a future date and if a time slot is selected
  const currentDate = new Date();
  // if (!selectedSessionDate || !selectedTimeSlot) {
  //   alert('Please select a future date and a time slot!');
  //   return;
  // }

  if (!selectedTimeSlot) {
    alert('Please select a time slot!');
    return;
  }
  if (!selectedDate) {
    alert('Please select a future date !');
    return;
  }

  if (selectedDate < currentDate) {
    alert('Please select a future date!');
    return;
  }

  console.log("selectedTimeSlot", selectedTimeSlot);
  console.log("selectedDate", selectedDate);

  console.log("ty selectedTimeSlot",   typeof selectedTimeSlot);
  console.log("ty selectedDate",   typeof selectedDate);

  

  // Proceed to the next step if everything is valid
  if (session?._id) {
    navigate(`/student/session-payment/${session._id}?date=${selectedDate.toISOString()}&time=${selectedTimeSlot}`);

  }
};



  
  return (
    <>
      <div className='w-screen h-screen bg-slate-200'>


        <div className='bg-white w-10/12 h-auto ml-28 mt-6 pt-5 px-12 pb-10 rounded-md  flex'>

          {/* LEFT SIDE */}
          <div className='w-4/12'>

              {/* BACK BUTTON */}
              {/* <Link to={`/student/session/${sessionId}`}>
                <div className='border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200 hover:border-blue-700 flex items-center justify-center'>
                  <BitcoinIconsArrowLeftFilledBlack className='' /> 
                </div>
              </Link> */}


                <Link to={`/student/session/${sessionId}`}>
                    <div className='border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                        <span className="text-black text-xl">←</span>
                    </div>
                </Link>



              <div className='pt-10 pr-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                  <img 
                    src={session?.instructorId?.image?.url}
                    alt={session?.title}
                    className=' w-12 h-12 object-cover rounded-full' 
                  />    
                  <p className='mt-3 text-lg text-blue-950 font-serif'>@{session?.instructorId.firstName} {session?.instructorId.lastName}</p>
                  <p className='mt-3 text-black text-lg font-normal'>{session?.title}</p>


                  <div className='flex mt-7 space-x-2 '>
                      {/* <MdiClockOutline /> */}
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>Duration: </p>
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>
                        {session?.duration ? formatDuration(session.duration) : 'N/A'}
                      </p>
                  </div>

                  <div className='flex mt-3 space-x-2'>
                      {/* <BiCashStack  /> */}
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>Fees: </p>
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>₹{session?.fee}</p>
                  </div>

                  
                  <div className='pt-12  font-normal'>
                        <p className='text-black text-base'>In this session you can expect:</p>

                        <div className='mt-3'>
                            <div className='flex space-x-4'>
                                <p className='text-black'>1.</p>
                                <p className='text-blue-950 text-base font-serif'>{session?.descriptionTitle}:</p>
                            </div>
                            <p className='text-gray-600 text-sm ml-7 pr-6 mt-2'>{session?.description}</p>
                        </div>
                  </div>
                  
              </div>


            
          </div>

          <div className='bg-gray-600 w-[1px]'></div>  {/* MIDDLE LINE */}
          


          {/* RIGHT SIDE */}
          <div className=' flex-grow pl-10'>

            <p className='mt-5 ml-3 text-black font-bold text-lg font-serif'>Select a Date & Time</p>
            

            <div className='flex w-full'>

                {/* **********calendar div********** */}
                <div className='w-8/12'>
                    <div className="ml-12 mb-4 mt-20 flex space-x-14 font-sans">
                        <div className='w-10 h-10 rounded-full cursor-pointer  hover:border hover:border-blue-700 flex items-center justify-center'>
                            <button onClick={handlePrevMonth}><UiwLeft /> </button>
                        </div>
                        <p className='text-gray-500 text-lg font-normal'>{formattedMonthYear}</p> {/* Display month and year */}
                        <div className=' w-10 h-10 rounded-full cursor-pointer hover:border hover:border-blue-700 flex items-center justify-center'>
                            <button onClick={handleNextMonth}><UiwRight /> </button>
                        </div>
                    </div>

                    <table className='border-collapse border-spacing-0'>
                        <thead>
                            <tr className='text-black font-light '>
                                <th className='text-sm font-normal px-4'>MON</th>
                                <th className='text-sm font-normal px-4'>TUE</th>
                                <th className='text-sm font-normal px-4'>WED</th>
                                <th className='text-sm font-normal px-4'>THU</th>
                                <th className='text-sm font-normal px-6'>FRI</th>
                                <th className='text-sm font-normal px-4'>SAT</th>
                                <th className='text-sm font-normal px-5'>SUN</th>
                            </tr>
                        </thead>
                        <tbody className='text-black'>
                            <div className='w-11 h-11  rounded-full'>
                                {/* {generateCalendar(selectedDate.getMonth(), selectedDate.getFullYear())} */}
                                {generateCalendar(selectedDate.getMonth(), selectedDate.getFullYear(), selectedDate, handleDateSelection)}
                            </div>
                        </tbody>
                    </table>
                </div>
                {/* **********end of calendar div********** */}


                <div className=' w-4/12 mt-20 ml-11'>
                    <p className='text-gray-500 font-normal'>Available Time slots</p>

                    <div className="mt-8">
                        {sortedTimeSlots.map((timeSlot, index) => {
                        const isSelected = timeSlot === selectedTimeSlot;  // Check if the time slot is selected
                        return (
                        <div
                            key={timeSlot}
                            className={`w-8/12 h-9 mt-3 border border-blue-500 rounded-sm flex items-center justify-center cursor-pointer ${
                            isSelected ? 'bg-[#f3d281]' : 'bg-white' // Apply rose color if selected
                            }`}
                            onClick={() => handleTimeSlotSelection(timeSlot)}
                        >
                            <p className={`font-medium ${isSelected ? 'text-black' : 'text-blue-600'}`}>
                            {formatTime(timeSlot)} {/* Format the time if necessary */}
                            </p>
                        </div>
                        );
                        })}
                    </div>
                </div>

            </div>

          
            {/* show selected date and time */}
            {/* <div className="mt-40">
                <p className="text-black font-medium">Selected Date: {selectedDate.toDateString()}</p>
                <p className="text-black font-medium">Selected Time Slot: {selectedTimeSlot || 'Not selected'}</p>
            </div> */}

            <button 
                onClick={() => {
                    if (session?._id) {
                        handleNextButtonClick()
                    }
                }}
                className='bg-[#3ee1a6] py-1 px-9 text-black font-medium border border-black rounded-full mt-56 ml-60 hover:bg-[#fbcfb1;]'
            >
                Next
            </button>
            




          </div>



        </div>


      </div>
    </>
  )
}

export default StudentBookSession;
