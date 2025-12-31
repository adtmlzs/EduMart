const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Poll
router.post('/create', auth, async (req, res) => {
    try {
        const { question, options, durationHours } = req.body;
        const createdBy = req.user.id;
        // Determine schoolId: if user is school admin, use their ID; else use user's schoolId
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + parseInt(durationHours));

        const poll = new Poll({
            question,
            options: options.map(opt => ({ text: opt, votes: 0 })),
            createdBy,
            schoolId,
            expiresAt
        });

        await poll.save();

        // Create Broadcast Notification
        const Notification = require('../models/Notification');
        await new Notification({
            userId: null, // Broadcast to all
            schoolId,
            message: `New Poll Created: "${question}". Go vote now!`,
            type: 'poll'
        }).save();

        res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        console.error('Create Poll Error:', error);
        res.status(500).json({ message: 'Server error creating poll' });
    }
});

// Get Polls for school
router.get('/', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const polls = await Poll.find({ schoolId })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({ polls });
    } catch (error) {
        console.error('Get Polls Error:', error);
        res.status(500).json({ message: 'Server error fetching polls' });
    }
});

// Vote in Poll
router.put('/vote/:id', auth, async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const userId = req.user.id;
        const poll = await Poll.findById(req.params.id);

        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        // Checks for strict isolation
        const userSchoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;
        if (poll.schoolId.toString() !== userSchoolId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to this poll' });
        }

        if (new Date() > poll.expiresAt) {
            return res.status(400).json({ message: 'This poll has expired' });
        }

        if (poll.votedUsers.includes(userId)) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        poll.options[optionIndex].votes += 1;
        poll.votedUsers.push(userId);

        await poll.save();
        await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });

        if (poll.createdBy.toString() !== userId) {
            const Notification = require('../models/Notification');
            const voter = await User.findById(userId);
            // Only create notification if it's not the creator voting on their own poll (unlikely but possible)
            if (voter) {
                await new Notification({
                    userId: poll.createdBy,
                    message: `${voter.name} voted on your poll: "${poll.question}"`,
                    type: 'poll',
                    schoolId: userSchoolId // Ensure notification has schoolId
                }).save();
            }
        }

        res.json({ message: 'Vote recorded!', poll });
    } catch (error) {
        console.error('Vote Error:', error);
        res.status(500).json({ message: 'Server error recording vote' });
    }
});

// End Poll manually (by creator)
router.put('/:id/end', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const poll = await Poll.findById(req.params.id);

        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        if (poll.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Only the creator can end this poll' });
        }

        poll.expiresAt = new Date();
        await poll.save();

        res.json({ message: 'Poll ended successfully', poll });
    } catch (error) {
        console.error('End Poll Error:', error);
        res.status(500).json({ message: 'Server error ending poll' });
    }
});

module.exports = router;
