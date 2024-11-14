import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosInstance } from '../../services/axiosInstance';

function BookingSummary() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const TAX_RATE = 0.10; // 10% tax rate
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
  if (!event || !user) return <div className="text-center mt-20">No event or user found.</div>;

  const tax = event.price * TAX_RATE;
  const totalCost = event.price + tax;

  const handleConfirmRegistration = async () => {
    try {
      const bookingResponse = await axiosInstance.post('http://localhost:5000/api/bookings', {
        event: eventId,
        user: user._id,
        numberOfTickets: 1,
        totalAmount: totalCost,
      });
      const response = await axiosInstance.post('/tickets/book', {
        eventId: eventId,
        price: event.price,
      });

      navigate(`/all-users/payment/${bookingResponse.data._id}?totalCost=${totalCost}`);
    } catch (error) {
      console.error(error);
      alert('Already Booked for this Event');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-300">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 mx-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Booking Summary</h2>

        {/* Event Details */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{event.name}</h3>
          <p className="text-gray-600 mt-2">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <strong>Location:</strong> {event.venue}
          </p>
          <p className="text-gray-800 font-semibold mt-4">
            <strong>Price per Ticket:</strong> ${event.price}
          </p>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-xl font-semibold text-gray-700">User Information</h4>
          <p className="text-gray-600 mt-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-700">Cost Breakdown</h4>
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">Price:</span>
            <span className="text-gray-800 font-semibold">${event.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="text-gray-800 font-semibold">${tax.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center font-bold text-xl">
            <span>Total Cost:</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Confirm Registration Button */}
        <button
          onClick={handleConfirmRegistration}
          className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Confirm Registration
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
