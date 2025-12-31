const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Club = require('../models/Club');
const Item = require('../models/Item');
const Confession = require('../models/Confession');

// Stats for School Admin
router.get('/stats', async (req, res) => {
    try {
        const { schoolId } = req.query;
        const totalStudents = await User.countDocuments({ schoolId, role: 'student' });
        const activeClubs = await Club.countDocuments({ schoolId });
        const totalItems = await Item.countDocuments({ schoolId });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const confessionsToday = await Confession.countDocuments({
            schoolId,
            createdAt: { $gte: startOfToday }
        });

        res.json({ totalStudents, activeClubs, totalItems, confessionsToday });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// Get all students for school
router.get('/students', async (req, res) => {
    try {
        const { schoolId } = req.query;
        const students = await User.find({ schoolId, role: 'student' }).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching students' });
    }
});

// Get all clubs with members
router.get('/clubs', async (req, res) => {
    try {
        const { schoolId } = req.query;
        const clubs = await Club.find({ schoolId })
            .populate('createdBy', 'name')
            .populate('members', 'name')
            .sort({ name: 1 });
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching clubs' });
    }
});

// Ban User
router.put('/ban-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = !user.isActive;
        await user.save();

        // Create notification for the user
        const Notification = require('../models/Notification');
        await new Notification({
            userId: user._id,
            message: `Your account has been ${user.isActive ? 'unbanned' : 'suspended'} by the school administrator.`,
            type: 'system'
        }).save();

        res.json({ message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error banning user' });
    }
});

// Delete Club
router.delete('/club/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Notify President
        const Notification = require('../models/Notification');
        await new Notification({
            userId: club.createdBy,
            message: `Your club "${club.name}" has been deleted by the school administrator.`,
            type: 'club'
        }).save();

        await Club.findByIdAndDelete(req.params.id);
        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting club' });
    }
});

module.exports = router;
