import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiEducationOutline, FluentEdit28Filled, TypcnUserAdd } from '../../assets/usersIcons/ProfileIcons'
import bg2 from '../../assets/userImgs/bg-2.jpeg'
import studentImg from '../../assets/userImgs/student.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { FaUserCircle } from 'react-icons/fa';



const StudentProfile = () => {

    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        about: '',
        country: '',
        education: '',
        profilePic: '',
      });
      
      const [imagePreview, setImagePreview] = useState('');

      useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await axiosInstance.get('/student/profile');

            console.log("res profile data in update all data------------",res.data);
            console.log("res profile data in update all profile------------",res.data.email);
            console.log("res profile data in update data------------",res.data.message);
    

            const { email, role,  firstName, lastName, about,country, education, profilePicUrl } = res.data;

           
            
    
    
            setProfileData({
              email: email || '',
              role: role || '',
              firstName: firstName || '',
              lastName: lastName || '',
              about: about || '',
              country: country || '',
              education: education || '',
              profilePic: profilePicUrl || '',
            });
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
        fetchProfile();
      }, []);



      console.log("profileeeeeeeeeeeeeee", profileData.profilePic);
      
  

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
                        <div>
                            <p className='text-lg text-primary-orange font-serif'>About</p>
                            <TeenyiconsUpSolid className='mt-2 ml-3' />
                        </div>

                        <a href={"/student/upcoming-sessions"}>
                            <p className='text-lg text-black font-serif'>Reserved Sessions</p>
                        </a>
                        <p className='text-lg text-black font-serif'>Posts</p>
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


        {/* user info */}
        <div className='ml-28 mt-8 w-10/12 h-auto space-x-8 flex' >

            {/* personal info */}
            <div className='mb-20 w-full h-auto bg-white rounded-md shadow-md space-y-8 pl-6'>
                <div className='flex justify-between items-center'>
                    <p className='mt-5 text-blue-950 text-xl font-serif '>Personal Info</p>
                    <FluentEdit28Filled  
                        className='mr-6 cursor-pointer hover:w-6 hover:h-6' 
                        onClick={() => navigate('/student/update-profile')}
                    />
                </div>

                <hr className='w-full' />
                <div className='biography pt-4'>
                    {profileData.about && (
                        <div className='flex space-x-4'>
                            <IonPerson />
                            <p className='-mt-1 text-black text-md font-serif'>About Me:</p>
                        </div>
                    )}
                    {profileData.about && (
                        <p className='ml-8 pr-3 mt-1 w-7/12 text-gray-600 text-sm'>{profileData.about}</p>
                    )}
                </div>

                <div className='country pt-4'>
                    {profileData.education && (
                        <div className='flex space-x-4'>
                            <MdiEducationOutline />
                            <p className='-mt-1 text-black text-md font-serif'>Education:</p>
                        </div>
                    )}
                    {profileData.education && (
                        <p className='ml-8 pr-3 mt-1 w-96 text-gray-600 text-sm'>{profileData.education} </p>
                    )}
                </div>

                <div className='occupation pt-2'>
                    {profileData.country && (
                        <div className='flex space-x-4'>
                            <LineiconsWorld />
                            <p className='-mt-1 text-black text-md font-serif'>Country:</p>
                        </div>
                    )}
                    {profileData.country && (
                        <p className='ml-8 pr-3 mt-1 w-96 text-gray-600 text-sm'>{profileData.country}</p>
                    )}
                </div>

                <div className='email pt-2 pb-12'>
                    {profileData.email && (
                        <div className='flex space-x-4'>
                            <IcRoundEmail />
                            <p className='-mt-1 text-black text-md font-serif'>Email:</p>
                        </div>
                    )}
                    {profileData.email && (
                        <p className='ml-8 pr-3 mt-1 w-96 text-gray-600 text-sm'>{profileData.email}</p>
                    )}
                </div>
            </div>


            


        </div>
        







      </div>
    </>
  )
}

export default StudentProfile;
