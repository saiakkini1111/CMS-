import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import EventCard from '../../components/events/EventCard';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { isOrganizer, isOrganizerOrAdmin, getUserInfo } from '../../services/localStorageInfo';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch user details from localStorage
  const user = getUserInfo();
  const userId = user?._id;

  // Get the current date
  const currentDate = new Date().toISOString();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let response;
        if (isOrganizer()) {
          // Fetch events specific to the organizer using userId
          response = await axiosInstance.get(`/events/organizer/${userId}`);
        } else {
          // Fetch all events for attendees/admins
          response = await axiosInstance.get('/events');
        }
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Could not fetch events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [userId]);

  const handleAddEvents = () => {
    navigate('/all-users/events/new');
  };

  const handleDelete = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
  };

  // Filter events based on user role
  const filteredEvents = events
    .filter((event) => {
      // If the user is an attendee, only show upcoming events
      if (!isOrganizerOrAdmin()) {
        return new Date(event.date) >= new Date(currentDate);
      }
      return true;
    })
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Upcoming Events</h1>

      {isOrganizerOrAdmin() && (
        <div className='flex cursor-pointer p-3' title="Add Events" onClick={handleAddEvents}>
          <IoMdAddCircleOutline className='text-4xl' />
          <p className='text-2xl'>Add Events</p>
        </div>
      )}

      <div className="my-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events by title..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No events found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
