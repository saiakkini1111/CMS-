import express from 'express';
import { addFeedback, getFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/add-feedback', addFeedback);
router.get('/:eventId', getFeedback);

export default router;
