import { BitcoinIconsArrowLeftFilled} from '../../assets/usersIcons/ProfileIcon';
import { FaCamera } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import axiosInstance from '../../utils/users/axiosInstance';







const UpdateSession = () => {

    const { sessionId } = useParams(); 
    // const sessionId = '6738cb1b64e0d66fc997428e';

    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [sessionData, setSessionData] = useState({
      
        title: '',
        introduction: '',
        // duration: '',
        fee: '',
        descriptionTitle: '',
        description: '',
        // rawTimeSlots: '',
        coverImage: '',
    });

    // session duration
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [displayDuration, setDisplayDuration] = useState('');

     // available time slots
     const [timeSlots, setTimeSlots] = useState<string[]>([]);
     const [newTimeSlot, setNewTimeSlot] = useState<string>('');

    // image
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [deleteImage, setDeleteImage] = useState(false); // Track if image should be deleted
    const [imageStatus, setImageStatus] = useState('unchanged'); // Tracks image status




    // Fetch and prefill the profile on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        // const res = await axiosInstance.get(`/instructor/session/${sessionId}`);
        const res = await axiosInstance.get(`/instructor/session/${sessionId}`);
        console.log("res session data in update all data------------",res.data);


        const { title, 
                introduction,
                duration, 
                fee,
                descriptionTitle,
                description,
                timeSlots, 
                sessionimgUrl, sessionimgKey } = res.data;

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: ",title,introduction,  duration, fee, descriptionTitle, description, timeSlots, sessionimgUrl);
        console.log("fetch profile from s3 onload---------------------------------------!!!!!!", res.data.sessionimgUrl);

        const [hoursStr, minutesStr] = duration.split(" : ");
        setHours(hoursStr);
        setMinutes(minutesStr);
        updateDisplayDuration(hoursStr, minutesStr)

        console.log("ooooooooooo",hoursStr, minutesStr);


        console.log("timeSlots in useeffect===========", timeSlots);
        

        
        setTimeSlots(timeSlots || []);
        
        
        
        setSessionData({
            title: title || '',
            introduction : introduction || '',
            // duration: duration || '',
            fee: fee || '',
            descriptionTitle: descriptionTitle || '',
            description: description || '',
            // timeSlots: timeSlots || '',
            coverImage: sessionimgUrl || '',
        });


      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    }
    fetchProfile();
  }, []);

   
  
    // Function to add a new time slot
    const addTimeSlot = () => {
      if (newTimeSlot) {
        setTimeSlots([...timeSlots, newTimeSlot]);
        setNewTimeSlot('');
      }
    };

    console.log("out side timeeeeeeeeeeeeeeeeeeeeeeeeeeee",timeSlots);
    
  
    // Function to remove a time slot, with `index` typed as a number
    const removeTimeSlot = (index: number) => {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    };

    function convertRailwayTimeTo12Hour(railwayTime: string): string {
        // Implement your conversion logic here
        // Example logic (replace with your actual implementation):
        let hours = parseInt(railwayTime.slice(0, 2));
        const minutes = railwayTime.slice(2);
        let amPm = 'AM';
      
        if (hours === 12) {
          amPm = 'PM';
        } else if (hours > 12) {
          hours -= 12;
          amPm = 'PM';
        }
      
        const convertedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${amPm}`;
        return convertedTime;
      }




  //handle duration
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive values or empty string
    if (value === '' || /^[0-9]*$/.test(value)) {
      setHours(value);
      updateDisplayDuration(value, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive values or empty string
    if (value === '' || /^[0-9]*$/.test(value)) {
      setMinutes(value);
      updateDisplayDuration(hours, value);
    }
  };

  const updateDisplayDuration = (hrs: string, mins: string) => {
    let durationString = '';

    // Convert values to integers for display
    const hoursInt = parseInt(hrs) || 0;
    const minutesInt = parseInt(mins) || 0;

    if (hoursInt > 0) {
      durationString += `${hoursInt} hr`;
    }
    if (minutesInt > 0) {
      durationString += ` ${minutesInt} min`;
    }

    setDisplayDuration(durationString.trim());
  };



  // Handler to update sessionData
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setSessionData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  
  // image preview
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    

    if (file && file.type.match('image.*')) {  // validate image file type
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setDeleteImage(false); // Reset delete flag if a new image is selected
        setImageStatus('updated');

    } else {
      alert("Please select a valid image file (jpg, png, etc.)");
    }

    // Reset the file input value to allow re-selection of the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = () => {
    setSessionData(prevData => ({
      ...prevData,
      coverImage: '', // Clears existing image in the state
    }));
    setSelectedImage(null);
    setImagePreview(''); // Reset image preview

    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDeleteImage(true); // Set delete flag
    // setImageStatus('deleted'); // Set status to deleted
  };



  const isValidName = (name: any) => /^[A-Za-z\s.,-]+$/.test(name);
  const isValidNumber = (value: any) => /^[0-9]+$/.test(value); // Checks if the input is only numbers
  const isNotEmptyString = (value: any) => value.trim().length > 0; // Checks for non-empty input with non-space characters


  const handleSave = async() => {
    console.log("displayDuration-------------",displayDuration);
    console.log("hours",hours);
    console.log("session duration", `${hours} : ${minutes}`);
    
    
    
    if (!sessionData.title ) {
      alert("Title required.");
      return;
    }
    if (!isNotEmptyString(sessionData.title)) {
      alert("Title required. Please provide a valid input.");
      return;
    }

    if (!sessionData.introduction ) {
      alert("Introduction required.");
      return;
    }
    if (!isNotEmptyString(sessionData.introduction)) {
      alert("Introduction required. Please provide a valid input.");
      return;
    }
    if (!hours ) {
      alert("Duration required.");
      return;
    }
    // if (!isNotEmptyString(hours)) {
    //   alert("Duration required. Please provide a valid input.");
    //   return;
    // }

    if (!sessionData.fee) {
      alert("Fees required.");
      return;
    }
    if (!isValidNumber(sessionData.fee)) {
      alert("Fees must be a valid number.");
      return;
    }
    // if (!isNotEmptyString(sessionData.fee)) {
    //   alert("Fee required. Please provide a valid input.");
    //   return;
    // }
    
    if (!sessionData.descriptionTitle ) {
      alert("Description title required.");
      return;
    }
    if (!isNotEmptyString(sessionData.descriptionTitle)) {
      alert("Description title required. Please provide a valid input.");
      return;
    }

    if (!sessionData.description ) {
      alert("Description required.");
      return;
    }
    if (!isNotEmptyString(sessionData.description)) {
      alert("Description required. Please provide a valid input.");
      return;
    }

    if (!timeSlots) {
      alert("Time slots required.");
      return;
    }

    if (!selectedImage) {
      alert("Image required. Please provide a valid input.");
      return;
    }

    // Code to submit form data
    console.log("session data :-----------", sessionData);

    console.log("time slotsssssssssssssss", timeSlots);
    

   

      const formData = new FormData();
      formData.append("title", sessionData.title);
      formData.append("introduction", sessionData.introduction);
      formData.append("duration", `${hours} : ${minutes}`);
      formData.append("fee", sessionData.fee);
      formData.append("descriptionTitle", sessionData.descriptionTitle);
      formData.append("description", sessionData.description);
      formData.append("rawTimeSlots", timeSlots.join(","));
        //   formData.append("coverImage", sessionData.coverImage);// Append image status to track image update
        formData.append("imageStatus", imageStatus);
        // formData.append("sessionId", sessionId);
        if (sessionId) {
          formData.append("sessionId", sessionId);
        } else {
          console.error("sessionId is undefined");
          alert("Session ID is missing. Please try again.");
          return; // Prevent further execution if sessionId is missing
        }


      // Add the session image file if selected
      console.log("selected image........", selectedImage);
      

        // formData.append("coverImage", selectedImage ); // Add new image if selected
        

        if (selectedImage && imageStatus === 'updated') {
            formData.append("coverImage", selectedImage); // Add new image if selected
          } else if (deleteImage) {
            formData.append("coverImage", ""); // Empty value to indicate image deletion
          }


    try {
        // Making a PUT request to update profile
        const response = await axiosInstance.put('/instructor/update-session', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log("Session updated , response.data", response.data);
        alert("Session updated successfully!");
        navigate('/instructor/sessions');
  
  
  
      } catch (error) {
        console.error("Error updating Session:", error);
        alert("Failed to update session. Please try again.");
      }
  };
  

  return (
    <>
      <div className='w-screen h-auto bg-slate-200 overflow-x-hidden'>


        {/* white parent div */}
            <div className='bg-white w-9/12 h-auto mb-11 ml-44 mt-6 rounded-2xl shadow-2xl shadow-slate-400 flex flex-col'>

                <div className='bg-blue-950 w-full h-24 rounded-tl-3xl rounded-tr-3xl pt-5 pl-2 flex  items-center space-x-80'>

                
                  <Link to="/instructor/sessions">
                    <div className=' border w-10 h-10 -mt-14 rounded-full cursor-pointer hover:bg-gray-400 hover:border-none flex items-center justify-center'>
                        <BitcoinIconsArrowLeftFilled className='' />
                    </div>
                    </Link>

                    <div className='flex'> 

                      <div className='ml-20 '>
                        <h1 className='font-bold text-xl'>Update Session</h1>
                      </div>
                    </div> 
                </div> 


                <div className='space-y-7 pt-7 flex-grow rounded-bl-3xl rounded-br-3xl'>

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Session Title</p>
                    <input type="text" 
                      placeholder='Title' 
                      name="title" 
                      value={sessionData.title} 
                      onChange={handleChange} 
                      className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Session Overview</p>
                    <input type="text" 
                      placeholder='Introduction' 
                      name="introduction" 
                      value={sessionData.introduction} 
                      onChange={handleChange} 
                      className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs pl-2' />
                  </div>
                  <hr />
                  

                  {/* <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Session Duration</p>
                    <input type="text" placeholder='Duration' className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div> */}

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                      <p className='text-black font-bold text-sm'>Session Duration</p>

                      <div className='flex items-center space-x-2'>
                        
                        <input
                          type="number"
                          placeholder='Hours'
                          value={hours}
                          onChange={handleHoursChange}
                          className='border border-gray-300 py-1 rounded-md text-black text-sm w-20 placeholder:text-xs pl-2'
                        />
                        
                        <input
                          type="number"
                          placeholder='Minutes'
                          value={minutes}
                          onChange={handleMinutesChange}
                          className='border border-gray-300 py-1 rounded-md text-black text-sm w-20 placeholder:text-xs pl-2'
                        />
                        <p className='text-red-500'>:</p>

                        <input
                          type="text"
                          value={displayDuration}
                          readOnly
                          className='border border-red-300 py-1 rounded-md text-black text-sm w-32 placeholder:text-xs pl-2'
                        />
                      </div>
                    </div>
                  <hr />


                  

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Session Fee</p>
                    <input type="text" 
                      placeholder='Fee' 
                      name="fee" 
                      value={sessionData.fee} 
                      onChange={handleChange} 
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Description Title</p>
                    <input 
                      type="text" 
                      placeholder='Description Title' 

                      name="descriptionTitle" 
                      value={sessionData.descriptionTitle} 
                      onChange={handleChange} 


                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Session Description</p>
                    <input 
                      type="text" 
                      placeholder='Description' 

                      name="description" 
                      value={sessionData.description} 
                      onChange={handleChange} 


                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  <div className='flex w-full ml-64 h-7 space-x-20'>
                    <div className='space-y-2'>
                      <p className='text-black font-bold text-sm'>Cover image</p>
                      {/* <p className='text-gray-500 font-normal text-xs'>Update your Photo</p> */}
                    </div>



                    <div className="flex space-x-8 items-center">
                      {/* Display Image Preview */}{/* Display profile picture if it exists */}
                      {sessionData.coverImage || imagePreview ? (
                        <img src={imagePreview || sessionData.coverImage}
                          alt="Profile Preview" className="w-11 h-11 object-cover rounded-lg"
                        />
                      ) : (
                        <div
                          className="w-11 h-11 flex items-center justify-center bg-black rounded-full cursor-pointer relative"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger file input on click
                        >
                          <FaCamera className="text-white" />
                        </div>
                      )}

                      {/* File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef} // Attach ref
                        className="opacity-0 absolute inset-0 w-11 h-11 cursor-pointer"
                      />

                      {/* Delete Button */}
                      {(sessionData.coverImage || imagePreview) && (
                        <button
                          onClick={handleDeleteImage}
                          className="text-gray-500 font-bold text-xs "
                        > Delete </button>
                      )}
                    </div>


                  </div>
                  <hr />






                  {/* Time Slot Section */}
                    <div className='flex w-full ml-64 h-7 space-x-28'>
                        <p className='text-black font-bold text-sm'>Add Time Slots</p>
                        <input
                            type="time"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                            placeholder="hr : min : sec"
                            className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2'
                        />
                        <button onClick={addTimeSlot} className='bg-blue-800 h-7 px-3 rounded-md text-white text-sm'>Add</button>
                    </div>

                    {/* Display Added Time Slots */}
                    <div className='ml-64 mt-4 space-y-2'>
                        {timeSlots.length > 0 && ( 
                            <>
                            <p className='text-blue-800 font-bold text-sm'>Scheduled Times</p>
                            <hr className='w-32'/>
                            <ul className='list-disc ml-8'>
                                {timeSlots.map((time, index) => (
                                <li key={index} className='flex items-center space-x-6'>
                                    <span className='text-black text-sm -ml-9'>
                                    {convertRailwayTimeTo12Hour(time)}
                                    </span>
                                    <button onClick={() => removeTimeSlot(index)} className='text-red-500 text-xs font-bold'>
                                    Remove
                                    </button>
                                </li>
                                ))}
                            </ul>
                            </>
                        )}
                    </div>
                    <hr />

                  

                  <div className='flex justify-center'>
                        <button className='mb-8 bg-primary-orange h-8 px-9 rounded-md' onClick={handleSave}>Save</button>
                  </div>




                  

                </div>

            </div>



      </div>
    </>
  )
}

export default UpdateSession;
