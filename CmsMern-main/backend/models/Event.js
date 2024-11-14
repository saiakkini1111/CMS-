import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  speakers: [
    {
      name: String,
      bio: String,
      topic: String,
    },
  ],
  ticketsAvailable: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ], // List of attendees
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
