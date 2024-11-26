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
      <div className='w-screen h-auto bg-white overflow-x-hidden'>


        {/* white parent div */}
        <div className='ml-64 mt-10 mb-20 pl-10 pt-10 pb-10 bg-white w-8/12 h-auto  rounded-2xl shadow-2xl shadow-[#c3e3d7] flex flex-col'>

            <div className='flex items-center space-x-72'>
                <Link to="/instructor/profile">
                    <div className='border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                        <span className="text-black text-xl">←</span>
                    </div>
                </Link>

                <div className='text-black'> 
                    <h1 className='font-semibold text-xl font-serif'>Update Profile</h1>
                </div> 
            </div> 

            <div className=' space-y-7 pt-14 flex-grow rounded-bl-3xl rounded-br-3xl'>

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>First Name</p>
                <input 
                    type="text" 
                    placeholder='First Name' 
                    name="firstName" 
                    value={profileData.firstName} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Last Name</p>
                <input 
                    type="text" 
                    placeholder='Last Name' 
                    name="lastName" 
                    value={profileData.lastName} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-20'>
                <div className='space-y-2'>
                    <p className='text-black font-bold text-sm font-serif'>Your Photo</p>
                    <p className='text-gray-500 font-normal text-xs'>Update your Photo</p>
                </div>

                <div className="flex space-x-8 items-center">
                  {/* Display Image Preview */}{/* Display profile picture if it exists */}
                  {profileData.profilePic || imagePreview ? (
                    <img src={imagePreview || profileData.profilePic}
                      alt="Profile Preview" className="ml-4 w-11 h-11 object-cover rounded-lg"
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
                      className="text-red-500 font-bold text-xs"
                    > Delete </button>
                  )}
                </div>


              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>About You</p>
                <input 
                    type="text" 
                    placeholder='About' 
                    name="about" 
                    value={profileData.about} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Country</p>
                <input 
                    type="text" 
                    placeholder='Country' 
                    name="country" 
                    value={profileData.country} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Occupation</p>
                <input 
                    type="text" 
                    placeholder='Occupation' 
                    name="occupation" 
                    value={profileData.occupation} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Current institution</p>
                <input 
                    type="text" 
                    placeholder='Current institution' 
                    name="currentInstitution" 
                    value={profileData.currentInstitution} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Teaching Views</p>
                <input 
                    type="text" 
                    placeholder='Teaching Philosophy' 
                    name="teachingViews" 
                    value={profileData.teachingViews} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Achievements</p>
                <input 
                    type="text" 
                    placeholder='Achievements' 
                    name="achievements" 
                    value={profileData.achievements} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Education</p>
                <input 
                    type="text" 
                    placeholder='Education' 
                    name="education" 
                    value={profileData.education} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />

              <div className='flex w-full ml-64 h-10 space-x-28'>
                <p className='w-1/12 text-black font-semibold text-sm font-serif'>Experiences</p>
                <input 
                    type="text" 
                    placeholder='Experiences' 
                    name="experience" 
                    value={profileData.experience} 
                    onChange={handleChange} 
                    className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
              </div>
              <hr className='ml-60 mr-48 text-black ' />


            </div>

            {/* <div className='flex justify-center'>
                  <button className='mb-8 bg-primary-orange h-8 px-9 rounded-md' onClick={handleSave}>Save</button>
            </div> */}
            <button className='mt-14 ml-96 w-32 text-black border border-black bg-[#3ee1a6] hover:bg-primary-orange h-8 px-4 rounded-full mr-10' onClick={handleSave}>
              Save
            </button>

          </div>

      </div>
    </>
  )
}

export default InstructorUpdateProfile;
