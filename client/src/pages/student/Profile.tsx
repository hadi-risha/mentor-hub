import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiEducationOutline, FluentEdit28Filled } from '../../assets/usersIcons/ProfileIcons'
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
      <div className='w-screen h-screen bg-slate-200'>


        <div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg'>
            {/* first part */}
            <div className='w-full h-4/6 rounded-tl-lg rounded-tr-lg object-cover bg-center' style={{ backgroundImage: `url(${bg2})` }}>
                
                {/* profile photo section */}
                <div className='flex w-full h-3 pl-10 pt-8'>
                    {/* <img src={profileData.profilePic } className='w-20 h-20 object-cover rounded-full' alt="student Profile" /> */}

                    {profileData && profileData.profilePic ? (
                        <img
                        src={profileData.profilePic}
                        className="w-20 h-20 object-cover rounded-full"
                        alt="Student Profile"
                        />
                    ) : (
                        <FaUserCircle className="w-20 h-20 text-white" />
                    )}

                    

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
                    <div>
                        <p className='font-semibold text-gray-700'>{profileData.firstName} {profileData.lastName}</p>
                        <p className='font-light text-sm text-gray-700'>{profileData.role}</p>
                    </div>

                    <div className='flex space-x-20 ml-40'>
                        <div>
                            <p className='text-primary-orange'>About</p>
                            <TeenyiconsUpSolid className='mt-3 ml-3' />
                        </div>

                        <a href={"/student/upcoming-sessions"}>
                            <p className='text-black'>Sessions</p>
                        </a>
                        <p className='text-black'>Posts</p>

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


        {/* user info */}
        <div className='w-10/12 h-96 ml-28 mt-8 space-x-8 flex' >

            {/* personal info */}
            <div className='w-full h-96 bg-white rounded-md shadow-md pt-6 pl-6'>
                {/* <p className='text-blue-950 text-lg'>Personal Info</p> */}

                <div className='flex justify-between items-center'>
                    <p className='text-blue-950 text-lg'>Personal Info</p>
                    <FluentEdit28Filled  
                        className='mr-6 cursor-pointer hover:w-6 hover:h-6' 
                        onClick={() => navigate('/student/update-profile')}
                    />
                </div>

                <hr className='w-full mt-3' />
                <div className='biography pt-4'>
                    {profileData.about && (
                        <div className='flex space-x-4'>
                            <IonPerson />
                            <p className='text-blue-950 text-sm font-semibold'>About Me:</p>
                        </div>
                    )}
                    {profileData.about && (
                        <p className='w-7/12 text-gray-600 text-sm ml-8 pr-3'>{profileData.about}</p>
                    )}
                </div>

                <div className='country pt-4'>
                    {profileData.education && (
                        <div className='flex space-x-4'>
                            <MdiEducationOutline />
                            <p className='text-blue-950 text-sm font-semibold'>Education:</p>
                        </div>
                    )}
                    {profileData.education && (
                        <p className='w-96 text-gray-600 text-sm ml-8 pr-3'>{profileData.education} </p>
                    )}
                </div>

                <div className='occupation pt-4'>
                    {profileData.country && (
                        <div className='flex space-x-4'>
                            <LineiconsWorld />
                            <p className='text-blue-950 text-sm font-semibold'>Country:</p>
                        </div>
                    )}
                    {profileData.country && (
                        <p className='w-96 text-gray-600 text-sm ml-8 pr-3'>{profileData.country}</p>
                    )}
                </div>

                <div className='email pt-4'>
                    {profileData.email && (
                        <div className='flex space-x-4'>
                            <IcRoundEmail />
                            <p className='text-blue-950 text-sm font-semibold'>Email:</p>
                        </div>
                    )}
                    {profileData.email && (
                        <p className='w-96 text-gray-600 text-sm ml-8 pr-3'>{profileData.email}</p>
                    )}
                </div>

                {/* <div className='flex '>
                    <button className='w-12 h-6  bg-primary-orange rounded-lg text-xs ml-auto mr-6 '>Edit</button>
                </div> */}

            </div>


            


        </div>
        







      </div>
    </>
  )
}

export default StudentProfile;
