import React, { useEffect, useState } from 'react';
import { IoNotifications } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { axiosInstance } from '../../services/axiosInstance';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/notifications');
      setNotifications(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`, {});
      fetchNotifications();
      window.location.reload();
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <IoNotifications /> Notifications
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-3 rounded-lg border ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">{notification.message}</span>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CiCircleCheck /> Mark as Read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
