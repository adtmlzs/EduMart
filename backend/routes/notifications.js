const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating notification' });
    }
});

// Mark all notifications as read for user
router.put('/mark-all-read/:userId', async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ message: 'Server error marking all as read' });
    }
});

module.exports = router;
