// controllers/ticketController.js
import asyncHandler from 'express-async-handler';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import { createNotification } from '../controllers/notificationController.js'; // Import createNotification

// Fetch all booked events (tickets) for a specific user
export const getUserTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await Ticket.find({ attendee: req.user._id })
      .populate({
        path: 'event',
        select: 'name date venue', // Include only specific fields from Event
      });

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No booked events found' });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Fetch attendees for a specific event
export const getEventAttendees = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  try {
    const tickets = await Ticket.find({ event: eventId })
      .populate({
        path: 'attendee',
        select: 'name email', // Include only specific fields from User
      });

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No attendees found for this event' });
    }

    // Extract attendee details from tickets
    const attendees = tickets.map(ticket => ticket.attendee);
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Book a Ticket
// Book a new ticket and reduce available tickets
// Book a Ticket
export const bookTicket = asyncHandler(async (req, res) => {
  const { eventId, price } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if tickets are available
  if (event.ticketsAvailable <= 0) {
    return res.status(400).json({ message: 'No tickets available for this event' });
  }

  // Create a new ticket
  const ticket = new Ticket({
    event: event._id,
    attendee: req.user._id,
    price,
  });

  const bookedTicket = await ticket.save();

  // Decrease the number of available tickets
  event.ticketsAvailable -= 1;
  await event.save(); // Save the updated event with reduced tickets

  // Create notification for the user
  await createNotification(req.user._id, `You have successfully booked a ticket for the event: ${event.name}`, event._id);

  // Create notification for the event organizer
  await createNotification(event.organizer, `User ${req.user.name} has booked a ticket for your event: ${event.name}`, event._id);

  res.status(201).json(bookedTicket);
});
