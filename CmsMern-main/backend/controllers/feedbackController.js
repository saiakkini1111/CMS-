import Feedback from '../models/Feedback.js';

// Add feedback
export const addFeedback = async (req, res) => {
  const { eventId, userId, feedbackText, rating } = req.body;

  // Validate inputs
  if (!eventId || !userId || !feedbackText || !rating) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check for existing feedback from the same user for the same event
    const existingFeedback = await Feedback.findOne({ eventId, userId });

    if (existingFeedback) {
      return res.status(400).json({ error: "You have already submitted feedback for this event." });
    }

    // Save the new feedback
    const feedback = new Feedback({ eventId, userId, feedbackText, rating });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get feedback for an event
export const getFeedback = async (req, res) => {
  const { eventId } = req.params;

  try {
    const feedbacks = await Feedback.find({ eventId }).populate('userId', 'name');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
