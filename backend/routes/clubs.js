const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all clubs for school
router.get('/', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const clubs = await Club.find({ schoolId })
            .populate('createdBy', 'name email')
            .populate('members', 'name')
            .sort({ createdAt: -1 });

        res.json({ clubs });
    } catch (error) {
        console.error('Get Clubs Error:', error);
        res.status(500).json({ message: 'Server error fetching clubs' });
    }
});

// Get Single Club with full member names
router.get('/:id', auth, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)
            .populate('members', 'name')
            .populate('createdBy', 'name');

        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Strict Isolation: Check if club belongs to user's school
        const userSchoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;
        if (club.schoolId.toString() !== userSchoolId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to this club' });
        }

        res.json({ club });
    } catch (error) {
        console.error('Get Single Club Error:', error);
        res.status(500).json({ message: 'Server error fetching club details' });
    }
});

// Join Club
router.put('/join/:id', auth, async (req, res) => {
    try {
        const userId = req.user.id; // From Auth Token
        const clubId = req.params.id;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Isolation Check
        const userSchoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;
        if (club.schoolId.toString() !== userSchoolId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to this club' });
        }

        if (club.members.includes(userId)) {
            return res.status(400).json({ message: 'Already a member of this club' });
        }

        // Add user to club members
        await Club.findByIdAndUpdate(clubId, { $push: { members: userId } });

        // Add club to user's joined list
        await User.findByIdAndUpdate(userId, { $push: { clubsJoined: clubId } });

        const updatedClub = await Club.findById(clubId).populate('members', 'name');

        res.json({ message: 'Successfully joined the club!', club: updatedClub });
    } catch (error) {
        console.error('Join Club Error:', error);
        res.status(500).json({ message: 'Server error joining club' });
    }
});

// Leave Club
router.put('/leave/:id', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const clubId = req.params.id;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Isolation Check
        const userSchoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;
        if (club.schoolId.toString() !== userSchoolId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to this club' });
        }

        // Remove user from club members
        await Club.findByIdAndUpdate(clubId, { $pull: { members: userId } });

        // Remove club from user's joined list
        await User.findByIdAndUpdate(userId, { $pull: { clubsJoined: clubId } });

        const updatedClub = await Club.findById(clubId).populate('members', 'name');

        res.json({ message: 'Successfully left the club!', club: updatedClub });
    } catch (error) {
        console.error('Leave Club Error:', error);
        res.status(500).json({ message: 'Server error leaving club' });
    }
});


// Create new club
router.post('/', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const creatorId = req.user.id;
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const club = new Club({
            name,
            description,
            createdBy: creatorId,
            members: [creatorId],
            schoolId
        });

        await club.save();

        // Update user
        await User.findByIdAndUpdate(creatorId, {
            $inc: { points: 50 },
            $push: { clubsJoined: club._id }
        });

        // Create Broadcast Notification
        const Notification = require('../models/Notification');
        await new Notification({
            userId: null, // Broadcast
            schoolId,
            message: `New Club Founded: "${name}". Join the commune now!`,
            type: 'club'
        }).save();

        const populatedClub = await Club.findById(club._id).populate('members', 'name');
        res.status(201).json({ message: 'Club created!', club: populatedClub });
    } catch (error) {
        console.error('Create Club Error:', error);
        res.status(500).json({ message: 'Server error creating club' });
    }
});

module.exports = router;
