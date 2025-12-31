const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');

// Get all clubs for school
router.get('/', async (req, res) => {
    try {
        const { schoolId } = req.query;
        if (!schoolId) return res.status(400).json({ message: 'School ID required' });

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
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)
            .populate('members', 'name')
            .populate('createdBy', 'name');

        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json({ club });
    } catch (error) {
        console.error('Get Single Club Error:', error);
        res.status(500).json({ message: 'Server error fetching club details' });
    }
});

// Join Club
router.put('/join/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const clubId = req.params.id;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

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

// Create new club
router.post('/', async (req, res) => {
    try {
        const { name, description, createdBy, createdById, schoolId } = req.body;
        const creatorId = createdBy || createdById;

        const club = new Club({
            name,
            description,
            createdBy: creatorId,
            members: [creatorId],
            schoolId
        });

        await club.save();

        // Update user
        await User.findByIdAndUpdate(createdById, {
            $inc: { points: 50 },
            $push: { clubsJoined: club._id }
        });

        const populatedClub = await Club.findById(club._id).populate('members', 'name');
        res.status(201).json({ message: 'Club created!', club: populatedClub });
    } catch (error) {
        console.error('Create Club Error:', error);
        res.status(500).json({ message: 'Server error creating club' });
    }
});

module.exports = router;
