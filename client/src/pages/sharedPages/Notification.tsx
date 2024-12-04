import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/users/axiosInstance';

interface INotifications {
  _id: string;
  title: string;
  message: string;
  isShown: boolean;
}

const Notifications = () => {
  const { meetingRoomId } = useParams(); // get the link
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');
  const sessionId = queryParams.get('sessionId');

  // Correct state initialization
  const [notifications, setNotifications] = useState<INotifications[]>([]);

  // Fetch notifications on page mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const id = localStorage.getItem('userId');
        const role = localStorage.getItem('userRole');
        
        // Assuming you use the userId and role to fetch the notifications
        const response = await axiosInstance.get(`/${role}/notifications`, {
          params: { userId: id }
        });

        console.log("response.data:", response.data);
        setNotifications(response.data.notifications || []); // Assuming response contains 'notifications'
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="w-screen h-auto bg-white overflow-x-hidden">
        <div className="mx-auto mt-2 mb-36 bg-gray-600 w-4/12 h-auto py-2 px-5 shadow-2xl">
            <h2 className="text-center mb-4">Notifications</h2>
            
            {/* Check if there are notifications to display */}
            {notifications.length > 0 ? (
            <div>
                {notifications.map((notification) => (
                <div
                    key={notification._id}
                    className="notification-item w-full p-4 bg-gray-100 rounded-lg shadow-md mb-4"
                >
                    <h3 className="text-lg font-semibold text-center text-black mb-2">{notification.title}</h3>
                    <p className="text-sm text-center text-black">{notification.message}</p>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-center">No notifications found</p>
            )}
        </div>
    </div>

  );
};

export default Notifications;
