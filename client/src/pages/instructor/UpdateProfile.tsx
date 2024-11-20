import { IconamoonProfileCircleBold, BitcoinIconsArrowLeftFilled} from '../../assets/usersIcons/ProfileIcon';
import { FaCamera, FaUserCircle } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../utils/users/axiosInstance'
import config from '../../config';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate




const InstructorUpdateProfile = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    about: '',
    country: '',
    occupation: '',
    currentInstitution: '',
    teachingViews: '',
    achievements: '',
    education: '',
    experience: '',
    profilePic: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteImage, setDeleteImage] = useState(false); // Track if image should be deleted
  const [imageStatus, setImageStatus] = useState('unchanged'); // Tracks image status


  // Fetch and prefill the profile on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get('/instructor/profile');
        console.log("res profile data in update all data------------",res.data);

        const { email, 
              firstName, 
              lastName,
              about,
              country,
              occupation, 
              currentInstitution, 
              teachingViews, 
              achievements, 
              education, 
              experience, 
              profilePicUrl } = res.data;

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: ",firstName, lastName, email, about,country, occupation, currentInstitution, teachingViews, achievements, education, experience, profilePicUrl);
        console.log("fetch profile from s3 onload---------------------------------------!!!!!!", res.data.profilePicUrl);
        
        setProfileData({
          firstName: firstName || '',
          lastName: lastName || '',
          about: about || '',
          country: country || '',
          occupation: occupation || '',
          currentInstitution: currentInstitution || '',
          teachingViews: teachingViews || '',
          achievements: achievements || '',
          education: education || '',
          experience: experience || '',
          profilePic: profilePicUrl || '',
        });


      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);


  // Handler to update profileData
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
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
      setImageStatus('updated'); // Set status to updated if a new image is selected

    } else {
      alert("Please select a valid image file (jpg, png, etc.)");
    }

    // Reset the file input value to allow re-selection of the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleDeleteImage = () => {
    setProfileData(prevData => ({
      ...prevData,
      profilePic: '', // Clears existing image in the state
    }));
    setSelectedImage(null);
    setImagePreview(''); // Reset image preview

    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDeleteImage(true); // Set delete flag
    setImageStatus('deleted'); // Set status to deleted
  };





  // const isValidName = (name: any) => /^[A-Za-z]+$/.test(name);
  const isValidName = (name: any) => /^[A-Za-z\s.,-]+$/.test(name);
  const handleSave = async() => {
    if (!profileData.firstName ) {
      alert("First Name required.");
      return;
    }
    if (!isValidName(profileData.firstName)) {
      alert("First Name must contain only letters.");
      return;
    }
    if (!profileData.lastName) {
      alert("Last Name required.");
      return;
    }
    if (!isValidName(profileData.lastName)) {
      alert("Last Name must contain only letters.");
      return;
    }
    if (profileData.country && !isValidName(profileData.country)) {
      alert("Country must contain only letters or be empty.");
      return;
    }
    if (profileData.occupation && !isValidName(profileData.occupation)) {
      alert("Occupation must contain only letters or be empty.");
      return;
    }
    if (profileData.teachingViews && !isValidName(profileData.teachingViews)) {
      alert("Teaching Views must contain only letters or be empty.");
      return;
    }
    // Code to submit form data
    console.log("Profile data :-----------", profileData);

      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("about", profileData.about);
      formData.append("education", profileData.education);
      formData.append("country", profileData.country);
      formData.append("occupation", profileData.occupation);
      formData.append("currentInstitution", profileData.currentInstitution);
      formData.append("teachingViews", profileData.teachingViews);
      formData.append("achievements", profileData.achievements);
      formData.append("experience", profileData.experience);
      formData.append("imageStatus", imageStatus); // Append image status to track image update


      // Add the profile image file if selected
      console.log("selected image........", selectedImage);
      
      
      if (selectedImage && imageStatus === 'updated') {
        formData.append("profilePic", selectedImage); // Add new image if selected
      } else if (deleteImage) {
        formData.append("profilePic", ""); // Empty value to indicate image deletion
      }


    try {
      // Making a PUT request to update profile
      const response = await axiosInstance.put('/instructor/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Profile updated , response.data", response.data);
      alert("Profile updated successfully!");
      navigate('/instructor/profile');



    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  

  return (
    <>
      <div className='w-screen h-auto bg-slate-200 overflow-x-hidden'>


        {/* white parent div */}
            <div className='bg-white w-9/12 h-auto mb-11 ml-44 mt-6 rounded-2xl shadow-2xl shadow-slate-400 flex flex-col'>

                <div className='bg-blue-950 w-full h-24 rounded-tl-3xl rounded-tr-3xl pt-5 pl-2 flex  items-center space-x-80'>
                    <Link to="/instructor/profile">
                    <div className=' border w-10 h-10 -mt-14 rounded-full cursor-pointer hover:bg-gray-400 hover:border-none flex items-center justify-center'>
                        <BitcoinIconsArrowLeftFilled className='' />
                    </div>
                    </Link>

                    <div className='flex'> 
                      <FaUserCircle className='w-11 h-11 text-gray-500' />

                      <div className='ml-7 '>
                        <h1 className='font-bold text-xl'>Profile</h1>
                        <p className=' text-sm'>Update Your details</p>
                      </div>
                    </div> 

                    {/* <button className='bg-primary-orange h-8 px-4 rounded-sm mr-10'>Save</button> */}
                </div> 


                <div className='space-y-7 pt-7 flex-grow rounded-bl-3xl rounded-br-3xl'>

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>First Name</p>
                    <input 
                      type="text" 
                      placeholder='First Name' 
                      name="firstName" 
                      value={profileData.firstName} 
                      onChange={handleChange} 
                      className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs pl-2' />
                  </div>
                  <hr />
                  

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Last Name</p>
                    <input 
                      type="text" 
                      placeholder='Last Name' 
                      name="lastName" 
                      value={profileData.lastName} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-20'>
                    <div className='space-y-2'>
                      <p className='text-black font-bold text-sm'>Your Photo</p>
                      <p className='text-gray-500 font-normal text-xs'>Update your Photo</p>
                    </div>



                    <div className="flex space-x-8 items-center">
                      {/* Display Image Preview */}{/* Display profile picture if it exists */}
                      {profileData.profilePic || imagePreview ? (
                        <img src={imagePreview || profileData.profilePic}
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
                      {(profileData.profilePic || imagePreview) && (
                        <button
                          onClick={handleDeleteImage}
                          className="text-gray-500 font-bold text-xs "
                        > Delete </button>
                      )}
                    </div>


                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>About You</p>
                    <input 
                      type="text" 
                      placeholder='About' 
                      name="about" 
                      value={profileData.about} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Country</p>
                    <input 
                      type="text" 
                      placeholder='Country' 
                      name="country" 
                      value={profileData.country} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Occupation</p>
                    <input 
                      type="text" 
                      placeholder='Occupation' 
                      name="occupation" 
                      value={profileData.occupation} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />

                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Current institution</p>
                    <input 
                      type="text" 
                      placeholder='Current institution' 
                      name="currentInstitution" 
                      value={profileData.currentInstitution} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Teaching Views</p>
                    <input 
                      type="text" 
                      placeholder='Teaching Philosophy' 
                      name="teachingViews" 
                      value={profileData.teachingViews} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Achievements</p>
                    <input 
                      type="text" 
                      placeholder='Achievements' 
                      name="achievements" 
                      value={profileData.achievements} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Education</p>
                    <input 
                      type="text" 
                      placeholder='Education' 
                      name="education" 
                      value={profileData.education} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
                  </div>
                  <hr />


                  <div className='flex w-full ml-64 h-7 space-x-28'>
                    <p className='text-black font-bold text-sm'>Experiences</p>
                    <input 
                      type="text" 
                      placeholder='Experiences' 
                      name="experience" 
                      value={profileData.experience} 
                      onChange={handleChange}
                      className='border border-gray-300 rounded-md text-black text-sm w-4/12 placeholder:text-xs pl-2' />
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

export default InstructorUpdateProfile;