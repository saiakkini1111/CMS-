import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qrCode: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'paid',
  },
}, {
  timestamps: true,
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
