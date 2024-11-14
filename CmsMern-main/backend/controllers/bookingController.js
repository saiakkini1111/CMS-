// controllers/bookingController.js
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';// Create a new booking

export const createBooking = async (req, res) => {
  const { event, user, totalAmount, numberOfTickets } = req.body;

  try {
    // Validate if the event exists
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user already has a booking for this event with a 'Paid' status
    const existingBooking = await Booking.findOne({ event: eventExists._id, user: user });

    // Prevent duplicate bookings only if the payment is already completed
    if (existingBooking && existingBooking.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'User is already registered for this event.' });
    }

    // Create a new booking entry with the status as 'Pending'
    const booking = new Booking({
      event: eventExists._id,
      user: user,
      totalAmount,
      numberOfTickets,
      paymentStatus: 'Pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('event') // Populate event details
      .populate('user'); // Populate user details

    res.json(bookings); // Return all bookings
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status (Admin only)
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentStatus = paymentStatus || booking.paymentStatus; // Update the payment status
    await booking.save(); // Save the updated booking

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete booking by ID (Admin only)
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.remove(); // Remove the booking
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update booking status
export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body; // Get the new payment status

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentStatus = paymentStatus || booking.paymentStatus; // Update the payment status
    await booking.save(); // Save the updated booking

    res.json({ message: 'Booking updated successfully', booking }); // Return the updated booking
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserBookings = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Cast the userId to a MongoDB ObjectId manually
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;

    if (!userObjectId) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const bookings = await Booking.find({ user: userObjectId })
      .populate('event')
      .populate('user');

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

