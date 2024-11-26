import homeBg from "../../assets/userImgs/homeBg.png";
import std1 from "../../assets/userImgs/std1.png";
import std2 from "../../assets/userImgs/std2.png";
import std3 from "../../assets/userImgs/std3.png";
import std4 from "../../assets/userImgs/std4.png";
import std5 from "../../assets/userImgs/std5.png";
import std6 from "../../assets/userImgs/std6.png";
import std7 from "../../assets/userImgs/std7.png";


import biology from "../../assets/userImgs/biology.png";
import statistics from "../../assets/userImgs/statistics.png";
import publicSpeaking from "../../assets/userImgs/publicSpeaking.png";


import std8 from "../../assets/userImgs/std8.png";
import std9 from "../../assets/userImgs/std9.png";

import instructor from "../../assets/userImgs/instructor.png";
import instructor2 from "../../assets/userImgs/instructor2.png";
import instructor3 from "../../assets/userImgs/instructor3.png";
import instructo4 from "../../assets/userImgs/instructor4.png";
import instructor5 from "../../assets/userImgs/instructor5.png";
import instructor6 from "../../assets/userImgs/instructor6.jpeg";
import instructor7 from "../../assets/userImgs/instructor7.jpeg";
import instructor8 from "../../assets/userImgs/instructor8.jpeg";
import instructor9 from "../../assets/userImgs/instructor9.jpeg";
import instructor10 from "../../assets/userImgs/instructor10.jpeg";
import instructor11 from "../../assets/userImgs/instructor11.jpeg";
import instructor12 from "../../assets/userImgs/instructor12.jpeg";
import instructor13 from "../../assets/userImgs/instructor13.jpeg";
import instructor14 from "../../assets/userImgs/instructor14.jpeg";
import instructor15 from "../../assets/userImgs/instructor15.jpeg";
import { GrommetIconsFacebookOption, FeTwitter, FlowbiteLinkedinSolid } from "../../assets/usersIcons/FooterIcons";
import { CarbonLocationFilled, GameIconsGraduateCap } from "../../assets/usersIcons/ProfileIcons";

// import {}














// CSS for keyframes and animation
const style = {
  animation: `slide 20s linear infinite`
};

const ViewInstructors = () => {



  return (
    <div className='w-full h-auto overflow-x-hidden'>

        {/*  BODY  */}
        <div className='ml-32 mr-36 mb-40 pt-40 pl-14 pb-64 shadow h-auto  bg-white'> 
            <div className='w-full flex'>
                <div>
                    <p className='mb-3 text-5xl font-serif text-black'>
                        See Our Skillful 
                    </p>
                    <p className='mt-3 mb-3 text-5xl font-serif text-black'>
                        Instructors
                    </p>
                </div>
                {/* RIGHT ARROW */}
                <button className="mr-16 mt-10 w-20 h-20 border-2 jumping bg-[#3ee1a6] border-black text-black rounded-full flex items-center justify-center shadow-lg transition duration-300 ml-auto">
                    <span className="text-2xl">↓</span>
                </button>

            </div>



            {/* all mentors */}
            <div className="ml-32 mt-64 space-y-16">

                {/* mentor-1 */}
                <div className="flex space-x-6">

                    {/*    left side-instructor img    */}
                    <div className=' relative w-[330px] h-[430px] rounded-2xl border-2 border-black group hover:rounded-full transition-all duration-300'>
                        <div 
                            className='w-full h-full rounded-2xl group-hover:rounded-full transition-all duration-300' 
                            style={{ backgroundImage: `url(${instructor8})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div className='absolute flex bottom-10 left-0 w-full bg-opacity-60 py-4 px-7 text-white rounded-b-2xl space-x-6'>
                            <button className='ml-20 py-1 px-4 h-12 bg-[#c291fe] text-white border border-white rounded-full transition duration-300 transform hover:scale-105 active:scale-95'>
                                View Profile
                            </button>
                        </div>
                    </div>

                    {/*    right side-instructor details    */}
                    <div className="mt-10 h-[50vh] w-6/12">
                        <div className="h-full pl-14">
                            <p className='mt-7 mb-3 text-2xl font-serif text-black'>
                                Jaxon Clarke
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <GameIconsGraduateCap />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    English Language
                                </p>
                            </div>
                            <p className='w-10/12 text-black'>
                                Native English Teacher from the U.S. consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <CarbonLocationFilled />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    Berlin, Germany
                                </p>
                            </div>
                            <p className='mt-2 text-sm w-10/12 font-sans text-gray-500'>
                                125 Sessions
                            </p>
                        </div>
                    </div>
                </div>
                <hr className=" border-black  mr-64" />


                {/* mentor-2 */}
                <div className="flex space-x-6">

                    {/*    left side-instructor img    */}
                    <div className=' relative w-[330px] h-[430px] rounded-2xl border-2 border-black group hover:rounded-full transition-all duration-300'>
                        <div 
                            className='w-full h-full rounded-2xl group-hover:rounded-full transition-all duration-300' 
                            style={{ backgroundImage: `url(${instructor13})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div className='absolute flex bottom-10 left-0 w-full bg-opacity-60 py-4 px-7 text-white rounded-b-2xl space-x-6'>
                            <button className='ml-20 py-1 px-4 h-12 bg-[#c291fe] text-white border border-white rounded-full transition duration-300 transform hover:scale-105 active:scale-95'>
                                View Profile
                            </button>
                        </div>
                    </div>

                    {/*    right side-instructor details    */}
                    <div className="mt-10 h-[50vh] w-6/12">
                        <div className="h-full pl-14">
                            <p className='mt-7 mb-3 text-2xl font-serif text-black'>
                                Jaxon Clarke
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <GameIconsGraduateCap />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    English Language
                                </p>
                            </div>
                            <p className='w-10/12 text-black'>
                                Native English Teacher from the U.S. consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <CarbonLocationFilled />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    Berlin, Germany
                                </p>
                            </div>
                            <p className='mt-2 text-sm w-10/12 font-sans text-gray-500'>
                                125 Sessions
                            </p>
                        </div>
                    </div>
                </div>
                <hr className=" border-black  mr-64" />


                {/* mentor-3 */}
                <div className="flex space-x-6">

                    {/*    left side-instructor img    */}
                    <div className=' relative w-[330px] h-[430px] rounded-2xl border-2 border-black group hover:rounded-full transition-all duration-300'>
                        <div 
                            className='w-full h-full rounded-2xl group-hover:rounded-full transition-all duration-300' 
                            style={{ backgroundImage: `url(${instructor9})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div className='absolute flex bottom-10 left-0 w-full bg-opacity-60 py-4 px-7 text-white rounded-b-2xl space-x-6'>
                            <button className='ml-20 py-1 px-4 h-12 bg-[#c291fe] text-white border border-white rounded-full transition duration-300 transform hover:scale-105 active:scale-95'>
                                View Profile
                            </button>
                        </div>
                    </div>

                    {/*    right side-instructor details    */}
                    <div className="mt-10 h-[50vh] w-6/12">
                        <div className="h-full pl-14">
                            <p className='mt-7 mb-3 text-2xl font-serif text-black'>
                                Jaxon Clarke
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <GameIconsGraduateCap />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    English Language
                                </p>
                            </div>
                            <p className='w-10/12 text-black'>
                                Native English Teacher from the U.S. consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua
                            </p>
                            <div className="mt-7 flex space-x-4">
                                <CarbonLocationFilled />
                                <p className=' mb-3 text-lg font-serif text-black'> 
                                    Berlin, Germany
                                </p>
                            </div>
                            <p className='mt-2 text-sm w-10/12 font-sans text-gray-500'>
                                125 Sessions
                            </p>
                        </div>
                    </div>
                </div>
                <hr className=" border-black  mr-64" />

            </div>

        </div>




        {/*   FOOTER   */}
        <div className='ml-20 mr-36 mb-10 pt-10 pl-14 pb-20 h-auto flex space-x-52'> 
            <div className="w-3/12">
                <p className='text-black font-mono font-bold text-4xl'>C<span className='text-orange-600'>o</span>nnect</p>
                <p className="mt-6  text-black">Build your network, share skills, and open up on the Learning platform where you can be your whole self Forward Arrow</p>
            </div>
            
            <div className="space-x-32 flex">
                <div className="space-y-5">
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        About
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Team & Career
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Solutions
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Contact
                    </p>
                </div>

                <div className="space-y-5">
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Health & Fitness
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Business Coach
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Leadership
                    </p>
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        Programming
                    </p>
                </div>

                <div className="space-y-5 text-right"> 
                    <p className="text-black text-lg font-semibold hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        +91 8456785434
                    </p>
                    <p className="pb-8 text-black text-lg font-semibold underline hover:text-orange-600 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                        contact@connect.com
                    </p>

                    {/* icons */}
                    <div className="flex gap-4 justify-end">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-200 transition-all duration-200">
                                <GrommetIconsFacebookOption />
                            </div>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-200 transition-all duration-200">
                                <FeTwitter />
                            </div>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-200 transition-all duration-200">
                                <FlowbiteLinkedinSolid />
                            </div>
                        </a>
                    </div>
                    {/* /icons */}
                </div>

            </div>
            
        </div>
        {/*   /FOOTER   */}


















        {/* CSS for animation */}
        <style>{`
            @keyframes slide {
                0% {
                    transform: translateX(100%);
                }
                100% {
                    transform: translateX(-100%);
                }
            }
            @keyframes jump {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .jumping {
            animation: jump 1s ease-in-out infinite;
          }
        `}</style>
    </div>
  );
}

export default ViewInstructors;
