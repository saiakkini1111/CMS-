import express from 'express';
import { fetchNotifications,fetchUnreadNotificationCount, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Ensure you have an auth middleware

const router = express.Router();

// Route to get all notifications for the authenticated user
router.get('/', protect, fetchNotifications);

// Route to mark a notification as read
router.patch('/:notificationId/read', protect, markAsRead);
router.get('/unread-count', protect, fetchUnreadNotificationCount); // New route

export default router;
