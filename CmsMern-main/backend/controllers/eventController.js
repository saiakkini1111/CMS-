import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { createNotification } from '../controllers/notificationController.js'; // Import the notification function


// Create Event
export const createEvent = asyncHandler(async (req, res) => {
  const { name, date, venue, description, speakers, ticketsAvailable, imageURL, price } = req.body;

  const event = new Event({
    name,
    date,
    venue,
    description,
    speakers,
    ticketsAvailable,
    imageURL,
    organizer: req.user._id,
    price,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// In eventController.js
export const getEvents = async (req, res) => {
  try {
    // Fetch and sort events by date in ascending order
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Event by ID
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

export const registerAttendee = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
      console.log("Registering attendee. User ID:", userId, "Event ID:", eventId);
      const event = await Event.findById(eventId);
      if (!event) {
          console.log("Event not found:", eventId);
          return res.status(404).json({ message: 'Event not found' });
      }

      event.attendees.push(userId);
      await event.save();

      // Create notifications for the user and the event organizer
      await createNotification(userId, `You have successfully booked the event: ${event.name}`, event._id);
      await createNotification(event.organizer, `User ${req.user.name} has booked the event: ${event.name}`, event._id);

      console.log("Notifications sent successfully");
      res.status(201).json({ message: 'Successfully registered for the event' });
  } catch (error) {
      console.error("Error in registerAttendee:", error);
      res.status(400).json({ message: error.message });
  }
};

// Get Event Attendees
export const getEventAttendees = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Fetch the event and populate attendees
  const event = await Event.findById(eventId).populate('attendees', 'name email');
  console.log("Event data:", event); // Log the event for debugging

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Send the list of attendees if they exist
  const attendeesList = event.attendees ? event.attendees : [];
  console.log("Attendees list:", attendeesList); // Log the attendees list
  res.status(200).json(attendeesList);
});


// Delete Event by ID
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// Update Event by ID
export const updateEvent = asyncHandler(async (req, res) => {
  const { name, date, venue, description, speakers, ticketsAvailable, imageURL, price } = req.body;
  
  const event = await Event.findById(req.params.id);

  if (event) {
    event.name = name || event.name;
    event.date = date || event.date;
    event.venue = venue || event.venue;
    event.description = description || event.description;
    event.speakers = speakers || event.speakers;
    event.ticketsAvailable = ticketsAvailable || event.ticketsAvailable;
    event.imageURL = imageURL || event.imageURL;
    event.price = price || event.price;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// Controller to get events with attendee counts
export const getEventsWithAttendeeCounts = asyncHandler(async (req, res) => {
  try {
    // Aggregate tickets to calculate attendee counts per event
    const ticketAggregation = await Ticket.aggregate([
      {
        $group: {
          _id: "$event",
          attendeeCount: { $sum: 1 }
        }
      }
    ]);

    // Map ticket aggregation results to event details with organizer info
    const eventsWithAttendees = await Promise.all(
      ticketAggregation.map(async (ticketData) => {
        const event = await Event.findById(ticketData._id).populate("organizer", "name");

        if (event) {
          return {
            name: event.name,
            attendees: ticketData.attendeeCount,
            organizer: event.organizer ? event.organizer.name : 'Organizer Not Found'
          };
        }
        return null; // Exclude entries with missing events
      })
    );

    // Filter out any null results in case of missing events
    res.json(eventsWithAttendees.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendee counts", error });
  }
});

// Get Events by Organizer with Attendee Counts
export const getEventsByOrganizerWithAttendeeCounts = asyncHandler(async (req, res) => {
  const { organizerId } = req.params;

  try {
    // Validate the organizerId
    if (!mongoose.Types.ObjectId.isValid(organizerId)) {
      return res.status(400).json({ message: 'Invalid organizer ID' });
    }

    const ticketAggregation = await Ticket.aggregate([
      {
        $lookup: {
          from: 'events', // Ensure this matches your Events collection name
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails',
        },
      },
      {
        $unwind: '$eventDetails', // Unwind to access event fields
      },
      {
        $match: { 'eventDetails.organizer': new mongoose.Types.ObjectId(organizerId) }, // Match organizer ID
      },
      {
        $group: {
          _id: '$eventDetails.name',
          attendees: { $sum: 1 },
        },
      },
    ]);

    // Format the response
    const formattedEvents = ticketAggregation.map(event => ({
      name: event._id,
      value: event.attendees,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events for the organizer:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching events for the organizer', error: error.message }); // Include error message in response
  }
});
// In eventController.js
export const getEventsByOrganizer = asyncHandler(async (req, res) => {
  const { organizerId } = req.params;

  try {
    const events = await Event.find({ organizer: organizerId }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events for organizer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
