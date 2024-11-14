// src/components/EventForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../services/axiosInstance";

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
    speakers: [{ name: "", bio: "", topic: "" }],
    ticketsAvailable: 0,
    imageURL: "",
    price:"",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { eventId } = useParams();
  

  // Fetch event details for editing if eventId is provided
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const { data } = await axiosInstance.get(`/events/${eventId}`);
          console.log(data);
          
          setEvent(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event details:", error);
          setLoading(false);
        }
      };
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSpeakerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpeakers = [...event.speakers];
    updatedSpeakers[index][name] = value;
    setEvent((prevEvent) => ({
      ...prevEvent,
      speakers: updatedSpeakers,
    }));
  };

  const handleAddSpeaker = () => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      speakers: [...prevEvent.speakers, { name: "", bio: "", topic: "" }],
    }));
  };

  const handleRemoveSpeaker = (index) => {
    const updatedSpeakers = event.speakers.filter((_, i) => i !== index);
    setEvent((prevEvent) => ({
      ...prevEvent,
      speakers: updatedSpeakers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventId) {
        // Update existing event
        await axiosInstance.put(`/events/${eventId}`, event);
      } else {
        // Create new event
        await axiosInstance.post("/events", event);
      }
      navigate("/all-users/events"); // Redirect to the event list or any other page after submission
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg border-2 border-blue-300 rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {eventId ? "Edit Event" : "Create Event"}
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Name</label>
        <input
          type="text"
          name="name"
          value={event.name}
          onChange={handleChange}
          required
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Date</label>
        <input
          type="datetime-local"
          name="date"
          value={event.date.slice(0, 16)} // Format for input
          onChange={handleChange}
          required
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Venue</label>
        <input
          type="text"
          name="venue"
          value={event.venue}
          onChange={handleChange}
          required
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Price</label>
        <input
          type="text"
          name="price"
          value={event.price}
          onChange={handleChange}
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">
          Tickets Available
        </label>
        <input
          type="number"
          name="ticketsAvailable"
          value={event.ticketsAvailable}
          onChange={handleChange}
          required
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Image URL</label>
        <input
          type="url"
          name="imageURL"
          value={event.imageURL}
          onChange={handleChange}
          required
          className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Speakers</h2>
      {event.speakers.map((speaker, index) => (
        <div
          key={index}
          className="mb-4 p-4 border-2 border-blue-200 rounded bg-white"
        >
          <div className="flex justify-between mb-2">
            <label className="block text-gray-700 font-semibold">
              Speaker Name
            </label>
            <button
              type="button"
              onClick={() => handleRemoveSpeaker(index)}
              className="text-red-500 font-semibold"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            name="name"
            value={speaker.name}
            onChange={(e) => handleSpeakerChange(index, e)}
            required
            className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
          />
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Bio</label>
            <textarea
              name="bio"
              value={speaker.bio}
              onChange={(e) => handleSpeakerChange(index, e)}
              required
              className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Topic</label>
            <input
              type="text"
              name="topic"
              value={speaker.topic}
              onChange={(e) => handleSpeakerChange(index, e)}
              required
              className="mt-1 p-2 border-2 border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          onClick={handleAddSpeaker}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Add Speaker
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          {eventId ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
