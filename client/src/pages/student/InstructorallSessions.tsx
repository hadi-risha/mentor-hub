import { IcSharpPersonAdd, 
    PrimeStarFill, 
    AntDesignMessageFilled, 
    FluentNotepadEdit16Filled, 
    TeenyiconsUpSolid, 
    SolarMenuDotsBold, 
    IonPerson, LineiconsWorld, 
    PhBagFill, IcRoundEmail, 
    MdiHexagonMultiple, GameIconsAchievement, 
    MdiEducationOutline, TdesignStarFilled, 
    YellowStar, GrayStar } from '../../assets/usersIcons/ProfileIcons'
import instructor from '../../assets/userImgs/instructor.png'
import bg4 from '../../assets/userImgs/bg-4.jpeg'
import jsCourse from "../../assets/userImgs/jsCourse.png";
import { EmojioneMonotoneStar, EmojioneStar } from '../../assets/usersIcons/HomeIcons';
import { BiCashStack, MdiClockOutline } from '../../assets/usersIcons/SessionIcons';




const SingleInstructorAllSessions = () => {
  

  return (
    <>
      <div>


        <div className='bg-white w-10/12 h-48  ml-28 mt-5  rounded-tl-lg rounded-tr-lg'>
            {/* first part */}
            <div className='w-full h-4/6 rounded-tl-lg rounded-tr-lg object-cover bg-center' style={{ backgroundImage: `url(${bg4})` }}>
                
                {/* profile photo section */}
                <div className='flex w-full h-3 pl-10 pt-8'>
                    <img src={instructor} className=' w-20 h-20 object-cover rounded-full' alt="" />
                    <div className='pl-5 pt-2'>
                        <p className='text-lg text-white font-medium'>Sarah Thompson</p>
                        <p className='text-white font-light'>Instructor</p>
                        <div className='flex space-x-3 mt-3'>
                            <p className='text-gray-200 font-medium text-base'>Instrucror overall rating: </p>
                            <div className='flex mt-1'>
                                <YellowStar />
                                <YellowStar />
                                <YellowStar />
                                <YellowStar />
                                <GrayStar />

                            </div>
                            
                        </div>
                        
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
                        <p className='font-semibold text-gray-700'>Position: 
                            <span className='font-normal text-gray-700'> Professor of Computer Science</span>
                        </p>
                        <p className='font-semibold text-gray-700'>Institution: 
                            <span className='font-normal text-gray-700'> Oxford University</span>
                        </p>
                    </div>

                    <div className='flex space-x-20 ml-40'>
                        <p className='text-black'>About</p>
                        <div>
                            <p className='text-primary-orange'>Sessions</p>
                            <TeenyiconsUpSolid className='mt-3 ml-3' />
                        </div>
                        <p className='text-black'>Posts</p>

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





        {/* session cards */} 
        <div className="w-10/12 ml-28 flex mt-10  pt-5 bg-white">

            <div className='bg-white w-1.2/5 h-96 ml-14 rounded-md flex flex-col justify-center items-center border-2 border-gray-500'>
                <div className='bg-white w-full h-1/2 border-2 border-gray-500 rounded-tl-md rounded-tr-md'>
                    <img src={jsCourse} alt="My Local" className="w-full h-full object-cover" />
                </div>

                <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                    <p className='text-black font-bold text-lg'>Learn TypeScript</p>
                    <div className='flex mt-3 space-x-2'>
                        <MdiClockOutline />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>60 min</p>
                    </div>

                    <div className='flex mt-3 space-x-2'>
                        <BiCashStack />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>1,000</p>
                    </div>
                    
                    <div className='flex justify-center mt-5'>
                        <button className='py-1.5 px-5  bg-primary-orange rounded-full text-xs '>View Details</button>
                    </div>
                    
                </div>
            </div>

            <div className='bg-white w-1.2/5 h-96 ml-14 rounded-md flex flex-col justify-center items-center border-2 border-gray-500'>
                <div className='bg-white w-full h-1/2 border-2 border-gray-500 rounded-tl-md rounded-tr-md'>
                    <img src={jsCourse} alt="My Local" className="w-full h-full object-cover" />
                </div>

                <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                    <p className='text-black font-bold text-lg'>Learn TypeScript</p>
                    <div className='flex mt-3 space-x-2'>
                        <MdiClockOutline />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>60 min</p>
                    </div>

                    <div className='flex mt-3 space-x-2'>
                        <BiCashStack />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>1,000</p>
                    </div>
                    
                    <div className='flex justify-center mt-5'>
                        <button className='py-1.5 px-5  bg-primary-orange rounded-full text-xs '>View Details</button>
                    </div>
                    
                </div>
            </div>

            <div className='bg-white w-1.2/5 h-96 ml-14 rounded-md flex flex-col justify-center items-center border-2 border-gray-500'>
                <div className='bg-white w-full h-1/2 border-2 border-gray-500 rounded-tl-md rounded-tr-md'>
                    <img src={jsCourse} alt="My Local" className="w-full h-full object-cover" />
                </div>

                <div className='p-5 bg-white w-full h-1/2 rounded-bl-md rounded-br-md'>
                    <p className='text-black font-bold text-lg'>Learn TypeScript</p>
                    <div className='flex mt-3 space-x-2'>
                        <MdiClockOutline />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>60 min</p>
                    </div>

                    <div className='flex mt-3 space-x-2'>
                        <BiCashStack />
                        <p className='text-black text-lg font-medium font-serif -mt-1'>1,000</p>
                    </div>
                    
                    <div className='flex justify-center mt-5'>
                        <button className='py-1.5 px-5  bg-primary-orange rounded-full text-xs '>View Details</button>
                    </div>
                    
                </div>
            </div>

        </div>
        

        


      </div>
    </>
  )
}

export default SingleInstructorAllSessions;
