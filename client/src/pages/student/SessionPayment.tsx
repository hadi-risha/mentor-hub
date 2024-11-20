import { BiCashStack, MdiClockOutline } from '../../assets/usersIcons/SessionIcons';
import { BitcoinIconsArrowLeftFilledBlack } from '../../assets/usersIcons/ProfileIcon';
// import { generateCalendar } from '../../utils/users/generateCalendar';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/users/axiosInstance';
import { useLocation } from 'react-router-dom';




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

const SessionPayment = () => {

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const time = queryParams.get('time');

  console.log('Selected Date:', date);
  console.log('Selected Time Slot:', time);



  const [selectedDate, setSelectedDate] = useState(new Date());
  const [concerns, setConcerns] = useState("");


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





  const navigate = useNavigate();

    // const location = useLocation();

    // const sessionId = location.state?.sessionId; // Retrieve the session ID
    const { sessionId } = useParams();



    const [session, setSession] = useState<ISession>(); // Typed state
    const [loading, setLoading] = useState(true);

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



const handleConcernsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setConcerns(event.target.value);
};


// final button to proceed payment
// const handleButtonClick = (id: string) => {
//     // here send selected date, time, name, email, if concerns, payment info
//     // navigate(`/student/session-payment/${id}`);
//   };

  if (loading) return <div>Loading...</div>;



  // const handleCheckout = async () => {
  //   try {

  //     // http://localhost:3001/api
  //       const response = await fetch(`${config.backendUrl}/student/payment`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           amount: 5000, // Amount in cents (5000 = $50.00)
  //         }),
  //       });
  
  //       const data = await response.json();
  
  //       if (response.ok) {
          
  //         // window.location.href = data.url; // Redirect to the Checkout page

  //         console.log("data in payment success", data);
  //         console.log("url in payment success", data.url);
          
  //       } else {
  //         console.error('Error creating checkout session:', data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error during checkout process:', error);
  //     }
  //   };


  //   const handleCheckout = async () => { 
  //     try {


  //       // Prepare data to send
  //         const dataToSend = {
  //           sessionId: sessionId, // You already have sessionId from useParams
  //           selectedDate: date, // Selected date from the URL query parameters
  //           selectedTimeSlot: time, // Selected time from the URL query parameters
  //           concerns: concerns, // User's concerns input
  //           amount: session?.fee || 0, // Assuming fee is in session data
  //         };

  //         const response = await axiosInstance.post('/student/payment', dataToSend);

  
  //         // Access the response data
  //         const data = response.data;
  
  //         if (response.status === 200) {
  //             // Handle success (you can use window.location.href for redirect if needed)
  //             console.log("data in payment success", data);
  //             console.log("url in payment success", data.url);
  
  //             // Example: Redirect to the Checkout page
  //             window.location.href = data.url; // Uncomment if you want to redirect
  
  //         } else {
  //             console.error('Error creating checkout session:', data.error);
  //         }
  //     } catch (error) {
  //         // Handle errors
  //         console.error('Error during checkout process:', error);
  //     }
  // };
  

  const handleCheckout = async () => {
    try {
      // Prepare payment data
      const paymentData = {
        sessionId: sessionId,
        selectedDate: date,
        selectedTimeSlot: time,
        concerns: concerns,
        amount: session?.fee || 0,
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
  
      // Step 1: Initiate Payment
      const paymentResponse = await axiosInstance.post('/student/payment', paymentData);
  
      if (paymentResponse.status === 200) {
        const { url, paymentId } = paymentResponse.data; // Assume paymentId is returned
  
        // Step 2: Redirect for payment
        window.location.href = url;
  
        // Step 3: On Payment Success, Create Booking
        // Assume the payment success redirect lands on this page with query params
        const bookingData = {
          sessionId: sessionId,
          date: date,
          timeSlot: time,
          concerns: concerns,
          paymentId: paymentId, // Reference to the payment transaction
        };
  
        const bookingResponse = await axiosInstance.post('/student/create-booking', bookingData);
  
        if (bookingResponse.status === 200) {
          console.log('Booking created successfully:', bookingResponse.data);
          // Navigate to a success page or show a success message
          // navigate('/booking-success');
        } else {
          console.error('Error creating booking:', bookingResponse.data.error);
        }
      } else {
        console.error('Error creating payment session:', paymentResponse.data.error);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };
  


  return (
    <>
      <div className='w-screen h-screen bg-slate-200'>


        <div className='bg-white w-10/12 h-auto ml-28 mt-6 pt-5 px-12 pb-10 rounded-md  flex'>

          {/* LEFT SIDE */}
          <div className='w-4/12'>

              {/* BACK BUTTON */}
              <Link to={`/student/book-session/${session?._id}`}>
                <div className='border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200 hover:border-blue-700 flex items-center justify-center'>
                  <BitcoinIconsArrowLeftFilledBlack className='' /> 
                </div>
              </Link>


              <div className='pt-10 pr-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                  <img 
                    src={session?.instructorId?.image?.url}
                    alt={session?.title}
                    className=' w-12 h-12 object-cover rounded-full' 
                  />    
                  <p className='mt-3 text-sm text-blue-950'>@{session?.instructorId.firstName} {session?.instructorId.lastName}</p>
                  <p className='mt-3 text-black font-medium'>{session?.title}</p>


                  <div className='flex mt-7 space-x-2 '>
                      <MdiClockOutline />
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>
                        {session?.duration ? formatDuration(session.duration) : 'N/A'}
                      </p>
                  </div>

                  <div className='flex mt-3 space-x-2'>
                      <BiCashStack  />
                      <p className='text-blue-950 text-lg font-medium font-serif -mt-1'>₹{session?.fee}</p>
                  </div>

                  
                  <div className='pt-12  font-normal'>
                        <p className='text-black'>In this session you can expect:</p>

                        <div className='mt-3'>
                            <div className='flex space-x-4'>
                                <p className='text-black'>1.</p>
                                <p className='text-blue-950 text-sm font-semibold'>{session?.descriptionTitle}:</p>
                            </div>
                            <p className='text-gray-600 text-sm ml-8 pr-3'>{session?.description}</p>
                        </div>

                      {/* <div className='mt-3'>
                          <div className='flex space-x-4'>
                              <p className='text-black'>2.</p>
                              <p className='text-blue-950 text-sm font-semibold'>CSS3 Fundamentals:</p>
                          </div>
                          <p className='text-gray-600 text-sm ml-8 pr-3'>Understanding CSS3 fundamentals involves 
                              learning how to apply styles to HTML elements to enhance the user interface.
                          </p>
                      </div> */}
                  </div>
                  
              </div>


            
          </div>

          <div className='bg-gray-600 w-[1px]'></div>  {/* MIDDLE LINE */}
          


          {/* RIGHT SIDE */}
          <div className='flex-grow pl-9'>

            <p className='text-black font-medium text-lg'>Enter Details</p>
            

            <div className='pt-4 space-y-5'>
                <div>
                    {/* <p className='text-black text-sm'>Name<span className='text-red-600'>*</span></p> */}
                    <p className='text-black text-sm'>Name</p>

                    <input type="text" className="text-gray-500 border-2 border-gray-300 rounded-md h-10 w-8/12"  />
                </div>

                <div>
                    <p className='text-black text-sm'>Email</p>
                    <input type="text" className="text-gray-500 border-2 border-gray-300 rounded-md h-10 w-8/12"  />
                </div>

                <div>
                    <p className='text-black text-sm'>Do you have any concerns or special requests?</p>
                    <input 
                      type="text" 
                      className="text-gray-500 border-2 border-gray-300 rounded-md h-16 w-8/12" 
                      value={concerns} 
                      onChange={handleConcernsChange}
                     />
                </div>

                {/* <div className='w-8/12'>
                    <p className='text-black text-sm'>Payment information<span className='text-red-600'>*</span></p>
                    <div className='border border-gray-500 p-6'>
                        <div className='space-y-3'>
                            <input type="text" placeholder='Name on card' className="text-gray-500 border-2 border-gray-300 rounded-md h-7 w-4/12 placeholder:text-xs px-3 block"  />
                            <input type="text" placeholder='Card number' className="text-gray-500 border-2 border-gray-300 rounded-md h-7 w-4/12 placeholder:text-xs px-3 block"  />
                        </div>
                        
                        <div className='flex pt-5 h-11 space-x-2'>
                            <p className='text-gray-500 text-xs'>Your payments are strictly processed by Stripe</p>
                            <p className='text-gray-500 text-xs border border-black rounded-md px-1 py-1'>Powered By <span className='text-black text-xs font-bold'>Stripe</span></p>
                        </div>
                        

                    </div>
                </div> */}

                  


            </div>


          <button 
            onClick={handleCheckout}
            className='bg-primary-orange  py-1 px-9 rounded-md ml-44 mt-40'>Reserve Session
          </button>
            
          </div>



        </div>


            

        


      </div>
    </>
  )
}

export default SessionPayment;
