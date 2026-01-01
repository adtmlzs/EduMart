const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const User = require('../models/User');
        const School = require('../models/School');

        // Find account in either collection
        let account = await User.findById(userId);
        let schoolId;

        if (!account) {
            account = await School.findById(userId);
            if (!account) return res.status(404).json({ message: 'Account not found' });
            schoolId = account._id;
        } else {
            schoolId = account.schoolId;
        }

        // Fetch personal notifications AND broadcast notifications for the school
        let notifications = await Notification.find({
            $or: [
                { userId: userId },
                { schoolId: schoolId, userId: null } // Broadcasts
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50); // Increased limit

        // Post-process to set isRead correctly for broadcasts
        notifications = notifications.map(notif => {
            const notifObj = notif.toObject();
            if (!notifObj.userId) { // If broadcast
                // It is read if the user's ID is in the readBy array
                notifObj.isRead = notif.readBy && notif.readBy.map(id => id.toString()).includes(userId);
            }
            return notifObj;
        });

        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        const { userId } = req.body; // Expect userId in body now for broadcasts

        if (notification.userId) {
            // Personal notification
            notification.isRead = true;
        } else {
            // Broadcast notification
            if (userId && !notification.readBy.includes(userId)) {
                notification.readBy.push(userId);
            }
        }
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Read Notification Error:', error);
        res.status(500).json({ message: 'Server error updating notification' });
    }
});

// Mark all notifications as read for user
router.put('/mark-all-read/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const User = require('../models/User');
        const School = require('../models/School');

        let account = await User.findById(userId);
        let schoolId;

        if (!account) {
            account = await School.findById(userId);
            if (!account) return res.status(404).json({ message: 'Account not found' });
            schoolId = account._id;
        } else {
            schoolId = account.schoolId;
        }

        // 1. Mark personal notifications
        await Notification.updateMany(
            { userId: userId, isRead: false },
            { isRead: true }
        );

        // 2. Mark broadcast notifications (add user to readBy)
        await Notification.updateMany(
            { schoolId: schoolId, userId: null, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ message: 'Server error marking all as read' });
    }
});

module.exports = router;
