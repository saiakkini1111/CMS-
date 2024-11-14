import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleHomeNavigation = () => {
    navigate('/all-users/events');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-200 to-purple-200">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 mx-4">
        {/* Confirmation Header */}
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          🎉 Thank You for Your Booking!
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Your booking has been confirmed successfully.
        </p>

        {/* Booking Details */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h4>
          <div className="text-gray-700">
            <p className="mb-2">
              <strong>Booking ID:</strong> {bookingId || 'N/A'}
            </p>
            <p className="mb-2">
              <strong>Name:</strong> {user?.name || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
          </div>
        </div>

        {/* Home Navigation Button */}
        <button
          onClick={handleHomeNavigation}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
