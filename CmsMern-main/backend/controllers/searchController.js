import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// Search Events by Name
export const searchEvents = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const events = await Event.find({ ...keyword });
  res.json(events);
});
