import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/admin/axiosInstance";

interface INotification {
  _id: string;
  title: string;
  message: string;
  isShown: boolean;
  createdAt: string;
}

const NotificationManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false); // Modal state
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null); // Notification ID to change

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/admin/notifications"); 
      if (Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Invalid notifications format");
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;
      const response = await axiosInstance.put(`/admin/notification/update-status/${id}`, {
        isShown: updatedStatus,
      });

      if (response.data.updatedNotification) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === id
              ? { ...notification, isShown: updatedStatus }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  const confirmStatusChange = (id: string) => {
    setSelectedNotificationId(id);
    setShowConfirmation(true); // Show the confirmation modal
  };

  const handleConfirm = () => {
    if (selectedNotificationId) {
      const notification = notifications.find(n => n._id === selectedNotificationId);
      if (notification) {
        handleStatusChange(selectedNotificationId, notification.isShown);
      }
    }
    setShowConfirmation(false);
    setSelectedNotificationId(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedNotificationId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return <div>No notifications available</div>;
  }

  return (
    <div className="bg-gray-150 h-screen ml-16 mt-7">
      <div className="flex items-center">
        <h1 className="text-black text-2xl">Notification Management</h1>

        <select
          className="ml-auto mr-6 text-black bg-blue-100 border w-52 border-gray-300 p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
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

      <div id="printableTable" className="overflow-x-auto pt-6">
        <Link to={"/admin/create-notification"}>
          <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24">
            <path
              fill="#000"
              d="M7.007 12a.75.75 0 0 1 .75-.75h3.493V7.757a.75.75 0 0 1 1.5 0v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1-.75-.75"
            ></path>
            <path
              fill="#000"
              fillRule="evenodd"
              d="M7.317 3.769a42.5 42.5 0 0 1 9.366 0c1.827.204 3.302 1.643 3.516 3.48c.37 3.157.37 6.346 0 9.503c-.215 1.837-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.643-3.516-3.48a41 41 0 0 1 0-9.503c.214-1.837 1.69-3.276 3.516-3.48m9.2 1.49a41 41 0 0 0-9.034 0A2.486 2.486 0 0 0 5.29 7.424a39.4 39.4 0 0 0 0 9.154a2.486 2.486 0 0 0 2.193 2.164c2.977.332 6.057.332 9.034 0a2.486 2.486 0 0 0 2.192-2.164a39.4 39.4 0 0 0 0-9.154a2.486 2.486 0 0 0-2.192-2.163"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>

        <table className="bg-white w-11/12 h-5/6 mt-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-7">
          <thead>
            <tr>
              <th className="py-2 px-14 border-b text-black text-left">Notification</th>
              <th className="py-2 px-14 border-b text-black text-left">Update</th>
              <th className="py-2 px-14 border-b text-black text-left">Visibility Status</th>
              <th className="py-2 px-14 border-b text-black text-left">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id} className="hover:bg-gray-100">
                <td className="w-8/12 py-2 px-14 border-b text-gray-800">
                  <div className="border border-black py-7 px-3 rounded-xl flex flex-col justify-center items-center text-center">
                    <p className="font-bold">{notification.title}</p>
                    <p>{notification.message}</p>
                  </div>
                </td>
                <td className="py-2 px-14 border-b text-gray-800">
                  <Link to={`/admin/update-notification/${notification._id}`}>
                    <button className="bg-yellow-500 text-white w-24 px-4 rounded-md py-0.5">Update</button>
                  </Link>
                </td>
                <td className="w-7/12 py-2 px-14 border-b text-gray-800">
                  {notification.isShown === true ? <div>Shown</div> : <div>Hidden</div>}
                </td>
                {/* <td className="py-2 px-14 border-b text-gray-800">
                  <button
                    onClick={() => confirmStatusChange(notification._id)}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Change Status
                  </button>
                </td> */}

                <td className="py-2 px-14 border-b text-gray-800">
                  <button 
                    onClick={() => confirmStatusChange(notification._id)}
                    className="bg-red-500 text-white w-24 px-4 rounded-md py-0.5">
                    {notification.isShown === true ? (
                        <div>Hide</div>
                    ) : (
                        <div>Show</div>
                    )}
                  </button>
                </td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Confirmation Required</h2>
      <p className="text-lg text-gray-600 mb-6 text-center">Are you sure you want to change the notification status? </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-2 rounded-md focus:outline-none transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md focus:outline-none transition-colors duration-200"
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default NotificationManagement;
