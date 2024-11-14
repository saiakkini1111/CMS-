// routes/ticketRoutes.js
import express from 'express';
import { getUserTickets, bookTicket, getEventAttendees } from '../controllers/ticketController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get all tickets for a specific user
router.get('/my-tickets', protect, getUserTickets);

// Route to book a new ticket
router.post('/book', protect, bookTicket);

// Route to get attendees for a specific event
router.get('/:eventId/attendees', protect, getEventAttendees);

export default router;
