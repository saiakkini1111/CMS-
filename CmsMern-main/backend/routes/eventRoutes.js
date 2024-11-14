import express from 'express';
import { 
  createEvent, 
  getEventsWithAttendeeCounts, 
  getEvents, 
  getEventById, 
  deleteEvent, 
  updateEvent,
  registerAttendee,
  getEventAttendees,
  getEventsByOrganizerWithAttendeeCounts,
  getEventsByOrganizer
} from '../controllers/eventController.js';
import { protect, organizer, attendee, organizerOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for attendee counts for each organizer's event (must be placed before any :id routes)
router.get('/attendee-counts', getEventsWithAttendeeCounts);

// Route for creating a new event and getting all events
router.route('/')
  .post(protect, organizer, createEvent)
  .get(getEvents);

// Route for attendee registration
router.post('/:eventId/register', protect, attendee, registerAttendee);

// Route for getting event attendees (placed before any :id routes)
router.get('/:eventId/attendees', protect, organizer, getEventAttendees);

router.get('/organizer/:organizerId/attendee-counts', protect, organizerOrAdmin, getEventsByOrganizerWithAttendeeCounts);

// Routes for getting, updating, and deleting a specific event by ID
router.route('/:id')
  .get(getEventById)                   // Public
  .put(protect, organizer, updateEvent) // Only organizer can update
  .delete(protect, organizerOrAdmin, deleteEvent); // Organizer or Admin can delete
  
router.get('/organizer/:organizerId', protect, organizerOrAdmin, getEventsByOrganizer);


export default router;
