import Notification from '../models/Notification.js';

export const createNotification = async (userId, message, eventId) => {
    console.log("Creating notification with:", { userId, message, eventId });
    try {
        await Notification.create({ userId, message, eventId });
        console.log("Notification created successfully");
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};


// Fetch notifications for a specific user
export const fetchNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Fetch count of unread notifications for a specific user
export const fetchUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};