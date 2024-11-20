import { IcSharpPersonAdd, PrimeStarFill, AntDesignMessageFilled, 
    FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, 
    IonPerson, LineiconsWorld, PhBagFill, IcRoundEmail, MdiHexagonMultiple, 
    GameIconsAchievement, MdiEducationOutline, TdesignStarFilled, 
    FluentEdit28Filled} from '../../assets/usersIcons/ProfileIcons'
import instructor from '../../assets/userImgs/instructor.png';
import bg4 from '../../assets/userImgs/bg-4.jpeg';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';







const InstructorProfile = () => {
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        email: '',
        role: '',
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

      useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await axiosInstance.get('/instructor/profile');
            console.log("res profile data in update all data------------",res.data);
            console.log("res profile data in update data------------",res.data.message);
    

            const { 
                email, 
                role, 
                firstName, 
                lastName } = res.data;
    
            const {  
                about,
                country,
                occupation, 
                currentInstitution, 
                teachingViews, 
                achievements, 
                education, 
                experience, 
                profilePicUrl } = res.data;
    
    
    
            // console.log(firstName, lastName, email,role );
            // console.log(about,country, occupation, currentInstitution, teachingViews, achievements, education, experience, profilePicUrl);
        
            setProfileData({
              email: email || '',
              role: role || '',
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
  
  return (
    <>
      <div className='w-screen h-screen bg-slate-200'>


        <div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg'>
            {/* first part */}
            <div className='w-full h-4/6 rounded-tl-lg rounded-tr-lg object-cover bg-center' style={{ backgroundImage: `url(${bg4})` }}>
                
                {/* profile photo section */}
                <div className='flex w-full h-3 pl-10 pt-8'>
                    {/* <img src={profileData.profilePic || instructor} className='w-20 h-20 object-cover rounded-full' alt="Instructor Profile" /> */}
                    {profileData && profileData.profilePic ? (
                        <img
                            src={profileData.profilePic} className="w-20 h-20 object-cover rounded-full" alt="Instructor Profile"
                        />
                    ) : (
                        <FaUserCircle className="w-20 h-20 text-white" />
                    )}



                    <div className='pl-5 pt-2'>
                        <p className='text-lg text-white font-medium'>{profileData.firstName} {profileData.lastName}</p>
                        <p className='text-gray-200'>{profileData.role}</p>
                    </div>


                    

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
                        <div>
                            <p className='text-primary-orange'>About</p>
                            <TeenyiconsUpSolid className='mt-3 ml-3' />
                        </div>

                        <a href={"/instructor/sessions"}>
                            <p className='text-black'>Sessions</p>
                        </a>

                        <a href={"/instructor/booked-sessions"}>
                            <p className='text-black'>Confirmed Sessions</p>
                        </a>
                        
                        {/* <p className='text-black'>Posts</p> */}

                        <div className='bg-light-blue w-10 h-10 -mt-2 rounded-full flex items-center justify-center'>
                            <SolarMenuDotsBold />
                        </div>

                    </div>

                    <div className='ml-40 -mt-2'>
                        <p className='text-black text-md'>Followers</p>
                        <p className='text-primary-orange text-md ml-4'>120</p>
                    </div>
                </div> 
            </div>   
        </div>


        {/* user info */}
        <div className='w-10/12 h-96 ml-28 mt-8 space-x-8 flex' >

            {/* personal info */}
            <div className='w-5/12 h-96 bg-white rounded-md shadow-md pt-6 pl-6'>
                <div className='flex justify-between items-center'>
                    <p className='text-blue-950 text-lg'>Personal Info</p>
                    <FluentEdit28Filled  
                        className='mr-6 cursor-pointer hover:w-6 hover:h-6' 
                        onClick={() => navigate('/instructor/update-profile')}
                    />
                </div>
                
                <hr className='w-full mt-3' />
                <div className='biography pt-4'>
                    {profileData.about && (
                        <div className='flex space-x-4'>
                            <IonPerson />
                            <p className='text-blue-950 text-sm font-semibold'>Biography:</p>
                        </div>
                    )}
                    {profileData.about && (
                        <p className='w-96 text-gray-600 text-sm ml-8 pr-3'>{profileData.about}</p>
                    )}
                </div>

                <div className='country pt-4'>
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

                <div className='occupation pt-4'>
                    {profileData.occupation && (
                        <div className='flex space-x-4'>
                            <PhBagFill />
                            <p className='text-blue-950 text-sm font-semibold'>Occupation:</p>
                        </div>
                    )}
                    {profileData.occupation && (
                        <p className='w-96 text-gray-600 text-sm ml-8 pr-3'>{profileData.occupation}</p>
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

            </div>


            <div className='w-7/12 h-96 bg-white rounded-md shadow-md pt-6 pl-6'>
                <div className='flex justify-between items-center'>
                    <p className='text-blue-950 text-lg'>General Info</p>
                    <FluentEdit28Filled  
                        className='mr-6 cursor-pointer hover:w-6 hover:h-6'
                        onClick={() => navigate('/instructor/update-profile')}
                    />
                </div>
                <hr className='w-full mt-3' />

                <div className='flex space-x-8'>
                    <div className='teachingPhilosophy pt-4'>
                        {profileData.teachingViews && (
                            <div className='flex space-x-4'>
                                <MdiHexagonMultiple />
                                <p className='text-blue-950 text-sm font-semibold'>Teaching Philosophy:</p>
                            </div>
                        )}
                        {profileData.teachingViews && (
                            <p className='w-72 text-gray-600 text-sm ml-8 pr-3'>{profileData.teachingViews}</p>
                        )}
                    </div>
                    <div className='work pt-4'>
                        {profileData.experience && (
                            <div className='flex space-x-4'>
                                <TdesignStarFilled />
                                <p className='text-blue-950 text-sm font-semibold'>Work and Experience:</p>
                            </div>
                        )}
                        {profileData.experience && (
                            <p className='w-72 text-gray-600 text-sm ml-8 pr-3'>{profileData.experience} </p>
                        )}
                    </div>

                </div>
                

                <div className='achievements pt-4'>
                    {profileData.achievements && (
                        <div className='flex space-x-4'>
                            <GameIconsAchievement />
                            <p className='text-blue-950 text-sm font-semibold'>Achievements:</p>
                        </div>
                    )}
                    {profileData.achievements && (
                        <p className='w-72 text-gray-600 text-sm ml-8 pr-3'>{profileData.achievements}</p>
                    )}
                </div>

                <div className='education pt-4'>
                    {profileData.education && (
                        <div className='flex space-x-4'>
                            <MdiEducationOutline />
                            <p className='text-blue-950 text-sm font-semibold'>Education:</p>
                        </div>
                    )}
                    {profileData.education && (
                        <p className='w-72 text-gray-600 text-sm ml-8 pr-3'>{profileData.education}</p>
                    )}
                </div>

            </div>


        </div>
        

      </div>
    </>
  )
}

export default InstructorProfile;
