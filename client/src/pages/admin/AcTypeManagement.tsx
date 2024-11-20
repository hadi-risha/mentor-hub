import { useState, useEffect } from "react";
import personalImg from '../../assets/adminImgs/photo-hadi.jpg';
import axiosInstance from "../../utils/admin/axiosInstance";



interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    image: {
      url: string;
      key: string;
    };
    isBlocked: boolean;
}




const AccountTypeManagement = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSortOption, setSelectedSortOption] = useState('');

    const [users, setUsers] = useState<IUser[]>([]); // Typed state
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // Selected user for switching



    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/admin/users'); // Adjust the endpoint if needed
            console.log("response users", response.data.users);
            setUsers(response.data.users); // Store the users data
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

   

    const handleRoleSwitch = async () => {
        if (!selectedUser) return;

        const newRole = selectedUser.role === "instructor" ? "student" : "instructor";

        try {
            // let response = await axiosInstance.post('/student/switch-role');
            const response = await axiosInstance.post('/admin/switch-role', {
                id: selectedUser._id,
                newRole,
            });
  
            console.log("response",response);
            // Update UI after role switch
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                user._id === selectedUser._id ? { ...user, role: newRole } : user
                )
            );
            
        } catch (error) {
            console.error('Error switching role:', error);
        }

        setShowModal(false); // Close modal after completion

      };
    

      const openModal = (user: IUser) => {
        setSelectedUser(user);
        setShowModal(true);
      };
    
      if (loading) {
        return <div>Loading...</div>;
      }



    
    return (
      <>
        <div className='bg-gray-150 h-screen ml-16 mt-7'>


            <div className="flex items-center">
                <h1 className=' text-black text-2xl'>Account Type Management</h1>

                <select
                    className="ml-auto mr-6 text-black  bg-blue-100 border w-52 border-gray-300  p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={selectedSortOption}
                    onChange={(e) => setSelectedSortOption(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="nameAsc">Name: A to Z</option>
                    <option value="nameDesc">Name: Z to A</option>
                    <option value="dateAsc">Date: Oldest to Newest</option>
                    <option value="dateDesc">Date: Newest to Oldest</option>
                </select>

                <select
                    className="text-black mr-24 border w-60 border-gray-300 rounded-lg p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">Filter by</option>
                    <option value="Category A">Category A</option>
                    <option value="Category B">Category B</option>
                    <option value="Category C">Category C</option>
                </select>
            </div>


            <div id="printableTable" className="overflow-x-auto">
                <table className="bg-white w-11/12 h-5/6 mt-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-7">
                    <thead>
                        <tr>
                            <th className="py-2 px-14 border-b text-black text-left">A/c Type</th>
                            <th className="py-2 px-14 border-b text-black text-left">Name</th>
                            <th className="py-2 px-14 border-b text-black text-left">Email</th>
                            <th className="py-2 px-14 border-b text-black text-left">A/c switch to</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100">
                            <td className="py-2 px-14 border-b text-gray-800"> 
                                {user.role}
                            </td>
                            <td className="py-2 px-14 border-b text-gray-800">
                                <img
                                src={user.image?.url || personalImg}
                                alt="Profile"
                                className="w-10 h-10 rounded-lg inline-block mr-2 object-cover"
                                />
                                {user.firstName} {user.lastName}
                            </td>
                            <td className="py-2 px-14 border-b text-gray-800">
                                {user.email}
                            </td>
                            <td className="py-2 px-14 border-b text-gray-800">
                                {/* <button
                                    onClick={() => handleRoleSwitch(user._id, user.role === 'instructor' ? 'student' : 'instructor')}
                                    className={`${
                                        user.role === 'instructor' ? "bg-green-500" : "bg-yellow-500" 
                                    } text-white w-24 px-4 rounded-md py-0.5`}
                                >
                                    {user.role === 'instructor' ? "student" : "instructor" }
                                </button> */}


                                <button
                                    onClick={() => openModal(user)}
                                    className={`${
                                    user.role === "instructor" ? "bg-green-500" : "bg-yellow-500"
                                    } text-white w-24 px-4 rounded-md py-0.5`}
                                >
                                {user.role === "instructor" ? "Student" : "Instructor"}
                                </button>
                            </td>
                        </tr>
                    ))}



                        








                    </tbody>
                </table>
            </div>


        </div>



        {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4 text-black text-center">Change Role</h2>
            <p className="mb-6 text-black text-center">
              Are you sure you want to change the role of{" "}
              <strong>
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>{" "}
              to{" "}
              <span className="text-blue-600 font-bold">
                {selectedUser.role === "instructor" ? "Student" : "Instructor"}
              </span>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 px-4 py-2 rounded mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleSwitch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}





      </>
    );
  };
  
  export default AccountTypeManagement;
  