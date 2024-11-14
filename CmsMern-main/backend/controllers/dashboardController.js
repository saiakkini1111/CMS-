import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';

// Get Dashboard Statistics for Organizer
export const getDashboardStats = asyncHandler(async (req, res) => {
  const eventCount = await Event.countDocuments({ organizer: req.user._id });
  const ticketCount = await Ticket.countDocuments({});

  res.json({
    totalEvents: eventCount,
    totalTicketsSold: ticketCount,
  });
});
