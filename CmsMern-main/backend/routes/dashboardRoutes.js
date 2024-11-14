import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, organizer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, organizer, getDashboardStats);

export default router;
