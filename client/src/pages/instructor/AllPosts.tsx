import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/users/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { MaterialSymbolsAdd } from '../../assets/usersIcons/ProfileIcons';

interface IPost {
  _id: string;
  description: string;
  image: {
    url: string | '';
  };
  instructorId: {
      _id: string;
      firstName: string;
      lastName: string;
      role: string;
      country: string;
      image: {
          url: string;
      };
  };

}


const AllPosts = () => {
  const navigate = useNavigate();  
  const userRole = localStorage.getItem('userRole');


//   const [sessions, setSessions] = useState<ISession[]>([]); 
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]); 

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axiosInstance.get(`/${userRole}/posts`);
        console.log("Response data:", response.data);
  
        const posts = response.data.posts || []; 
  
        if (!Array.isArray(posts)) {
          console.error('Unexpected posts format:', response.data);
          setLoading(false);
          return;
        }
  
        console.log("Parsed posts:", posts);
        setPosts(posts); // Update state with session data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    }
  
    fetchPosts();
  }, []);


  
  // const handleViewDetails = (sessionId: string) => {
  //   navigate(`/instructor/session/${sessionId}`);
  // };






  

  return (
    <>
      <div className='w-screen !h-auto py-16 px-20 bg-gray-100 flex flex-col items-center space-y-12'>

        {userRole === 'instructor' ? (
            <div className="ml-auto mr-28 relative group">
              <a href="/instructor/create-post">
                  <div className="bg-primary-orange w-10 h-10 -mt-2 rounded-full flex items-center justify-center hover:border hover:border-black">
                      <MaterialSymbolsAdd />
                  </div>
              </a>
              {/* Tooltip for text */}
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Create
              </div>
            </div>

        ) : (
          <p></p>
        )}
      

        {loading ? (
            <p>Loading...</p>
        ) : posts.length > 0 ? (
            posts.map((post) => (
        
                <div key={post._id} className="px-28 py-10 w-10/12 h-auto shadow-2xl bg-white justify-center space-y-3 rounded-lg">
                    <div className='flex space-x-4'>
                      <img src={post.instructorId.image.url} alt="" className='h-14 w-14 rounded-full object-cover' />
                      <div>
                        <p className='font-semibold text-primary-orange'>{post.instructorId.firstName} {post.instructorId.lastName}</p>
                        <p className='text-[#7B7B7B]'>{post.instructorId.role} </p>
                      </div>

                    </div>

                    <img src={post.image.url} alt="" className="w-full h-[400px] object-cover" />

                    <p className='text-[#727895]'>{post.description}</p>
                    <hr className='border border-gray-200' />

                    <div className='flex space-x-6'>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48"><path fill="red" stroke="red" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"></path></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={25} viewBox="0 0 24 24"><path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1"></path></svg>
                    </div>

                </div>
            ))
        ) : (
            <p>No upcoming sessions available.</p>
        )}

      </div>
    </>
  )
}

export default AllPosts;
