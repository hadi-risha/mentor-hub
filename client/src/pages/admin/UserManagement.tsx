import { useEffect, useState } from "react";
import personalImg from '../../assets/adminImgs/photo-hadi.jpg'
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




const UserManagement = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSortOption, setSelectedSortOption] = useState('');

    const [users, setUsers] = useState<IUser[]>([]); // Typed state
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // Track the selected user
    const [actionType, setActionType] = useState<"block" | "unblock" | null>(null); // Track the action type

    

    // Fetch users function
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


    if (loading) {
        return <div>Loading...</div>; // Add a loading state
    }

    const toggleBlockUser = (user: IUser, action: "block" | "unblock") => {
        setSelectedUser(user);
        setActionType(action);
        setShowModal(true); // Show the confirmation modal
    };
    
      const handleConfirmation = async () => {
        if (!selectedUser || !actionType) return;
    
        // Optimistic UI update: Update state before making the API call
        const updatedUsers = users.map(user =>
          user._id === selectedUser._id ? { ...user, isBlocked: actionType === "block" } : user
        );
        setUsers(updatedUsers);
    
        try {
          const response = await axiosInstance.patch(`/admin/user/block/${selectedUser._id}`, {
            isBlocked: actionType === "block",
          });
    
          // Re-fetch the users after the block/unblock action
          await fetchUsers();
          setShowModal(false); // Close modal on success
        } catch (error) {
          console.error(`Failed to ${actionType === 'block' ? 'block' : 'unblock'} user:`, error);
          // If the API call fails, revert the UI changes
          setUsers(users.map(user =>
            user._id === selectedUser._id ? { ...user, isBlocked: !selectedUser.isBlocked } : user
          ));
          setShowModal(false); // Close modal on failure
        }
      };
    
      const handleCancel = () => {
        setShowModal(false); // Close modal without making any changes
      };
    
      if (loading) {
        return <div>Loading...</div>; // Add a loading state
      }

    
    return (
      <>
        <div className='bg-gray-150 h-screen ml-16 mt-7'>


            <div className="flex items-center">
                <h1 className=' text-black text-2xl'>Users</h1>

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
                {/* <table className="bg-white w-11/12 h-5/6 mt-5 shadow-md p-7"> */}
                <table className="bg-white w-11/12 h-5/6 mt-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-7">

                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-black text-left">Name</th>
                            <th className="py-2 px-4 border-b text-black text-left">Email</th>
                            <th className="py-2 px-4 border-b text-black text-left">Role</th>
                            {/* <th className="py-2 px-4 border-b text-black text-left">Type</th> */}
                            <th className="py-2 px-4 border-b text-black text-left">Account Status</th>
                            <th className="py-2 px-4 border-b text-black text-left">Status Update</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-gray-800">
                                    <img
                                        src={user.image?.url || personalImg}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-10 h-10 rounded-lg inline-block mr-2 object-cover"
                                    />
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-800">{user.email}</td>
                                <td className="py-2 px-4 border-b text-gray-800">{user.role || 'User'}</td>
                                {/* <td className="py-2 px-4 border-b text-gray-800">
                                    {user.role === 'instructor' ? 'Full Access' : 'Limited Access'}
                                </td> */}
                                <td className="py-2 px-4 border-b text-gray-800">
                                    {user.isBlocked === true ? "Blocked" : 'Not Blocked'}
                                </td>

                                <td className="py-2 px-9 border-b text-gray-800">
                                    {user.isBlocked ?
                                        (
                                            <button 
                                                onClick={() => toggleBlockUser(user, 'unblock')}
                                                className="bg-red-500 text-white px-2 text-sm rounded-md py-1"
                                            >Unblock
                                            </button>
                                        ):(
                                            <button 
                                            onClick={() => toggleBlockUser(user, 'block')}
                                            className="bg-green-500 text-white px-4 rounded-md py-0.5"
                                            >Block
                                            </button>
                                        )
                                    }                                
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            

{showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-black capitalize text-center">
                {actionType} User
            </h3>
            <p className="text-black text-center mt-2">
                Are you sure you want to {actionType} this user?
            </p>
            <div className="mt-4 flex justify-center space-x-4"> {/* Added space-x-4 */}
                <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmation}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
)}








        </div>
      </>
    );
  };
  
  export default UserManagement;
  