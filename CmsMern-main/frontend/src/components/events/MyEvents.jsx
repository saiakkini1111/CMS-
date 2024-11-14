import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MyEvents = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Define navigate

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axiosInstance.get("/bookings");
        console.log(data);
        setTickets(data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleGiveFeedback = (eventId) => {
    navigate(`/all-users/events/feedback/${eventId}`);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading your booked events...</p>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => setLoading(true)} // Retry fetching data
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter tickets with valid events and 'Paid' status
  const validTickets = tickets.filter(
    (ticket) => ticket.event !== null && ticket.paymentStatus === "Paid"
  );

  if (validTickets.length === 0) {
    return (
      <div>
        <p className="text-center text-gray-500">
          You have no paid booked events.
        </p>
      </div>
    );
  }

  return (
    <div className="my-events container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Paid Booked Events
      </h2>
      <ul className="space-y-4 border-gray-300">
        {validTickets.map((ticket) => (
          <div key={ticket._id}>
            <li className="event-item border rounded-lg shadow-sm p-4 bg-white">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {ticket.event.name}
              </h3>
              <p className="text-gray-700">
                <strong>Date:</strong>{" "}
                {new Date(ticket.event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Venue:</strong> {ticket.event.venue}
              </p>
              <p className="text-gray-700">
                <strong>Price:</strong> ${ticket.totalAmount}
              </p>
              <p className="text-green-600 text-sm font-medium">
                <strong>Status:</strong> Paid
              </p>
            </li>
            <button
              onClick={() => handleGiveFeedback(ticket.event._id)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Give Feedback
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MyEvents;
