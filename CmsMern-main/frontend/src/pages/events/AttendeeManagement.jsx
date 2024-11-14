import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../services/axiosInstance"; // Import axiosInstance
import Loading from "../../components/loading/Loading";

const AttendeeManagement = () => {
  const [events, setEvents] = useState([]); // Store events fetched from backend
  const [attendees, setAttendees] = useState({}); // Store attendees per event
  const [attendeesVisibility, setAttendeesVisibility] = useState({}); // Track visibility of attendees per event
  const [loading, setLoading] = useState(false); // Loading state for events
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/events"); // Fetch events from backend
        console.log('data',data);
        setEvents(data); // Store events directly as provided from the backend
        setLoading(false);
      } catch (err) {
        setError("Error fetching events.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  

  const toggleAttendees = async (eventId) => {
    // If the attendees for this event are already visible, hide them
    if (attendeesVisibility[eventId]) {
      setAttendeesVisibility((prevState) => ({
        ...prevState,
        [eventId]: false,
      }));
      return; // Exit early since we're hiding
    }
  
    // If not visible and attendees were not fetched yet, fetch them
    if (!attendees[eventId]) {
      try {
        const { data } = await axiosInstance.get(`/tickets/${eventId}/attendees`); // Fetch attendees from ticket controller
        setAttendees((prevState) => ({
          ...prevState,
          [eventId]: data, // Store attendees for this event
        }));
      } catch (err) {
        setError(err.response.data.message); // Handle errors
        console.error("Error fetching attendees:", err); // Log the error for debugging
      }
    }
  
    // Now set attendees visibility to true after fetching data
    setAttendeesVisibility((prevState) => ({
      ...prevState,
      [eventId]: true, // Show attendees for this event
    }));
  };
  
  

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    ); // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error display
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        My Created Events
      </h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={event.imageURL}
                alt={event.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {event.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 font-semibold">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-800 font-semibold">
                    Venue: {event.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 font-bold">
                    Tickets Available: {event.ticketsAvailable}
                  </span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                  onClick={() => toggleAttendees(event._id)}
                >
                  {attendeesVisibility[event._id] ? "Hide Attendees" : "View Attendees"}
                </button>

                {/* Attendees List - Visible only if the button is toggled */}
                {attendeesVisibility[event._id] && attendees[event._id] && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Attendees</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {attendees[event._id].map((attendee) => (
                        <div
                          key={attendee._id}
                          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                              <span className="text-lg font-bold text-gray-700">
                                {attendee.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">{attendee.name}</span>
                            <a
                              href={`mailto:${attendee.email}`}
                              className="text-blue-500 underline mt-2"
                            >
                              {attendee.email}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No events found. Please create some events first.</div>
      )}
    </div>
  );
};

export default AttendeeManagement;
