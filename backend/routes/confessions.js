const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');
const auth = require('../middleware/auth');

// Submit confession (Instant publish)
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const confession = new Confession({
            content,
            schoolId
        });

        await confession.save();
        res.status(201).json({ message: 'Confession posted!', confession });
    } catch (error) {
        console.error('Post Confession Error:', error);
        res.status(500).json({ message: 'Server error posting confession' });
    }
});

// Get all confessions for school
router.get('/', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const confessions = await Confession.find({ schoolId })
            .sort({ createdAt: -1 });

        res.json({ confessions });
    } catch (error) {
        console.error('Get Confessions Error:', error);
        res.status(500).json({ message: 'Server error fetching confessions' });
    }
});

// Upvote/Downvote logic
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'up' or 'down'
        const userId = req.user.id;

        const confession = await Confession.findById(id);
        if (!confession) return res.status(404).json({ message: 'Confession not found' });

        const hasUpvoted = confession.upvotes.includes(userId);
        const hasDownvoted = confession.downvotes.includes(userId);

        if (type === 'up') {
            if (hasUpvoted) {
                // Remove upvote
                confession.upvotes = confession.upvotes.filter(uid => uid.toString() !== userId);
            } else {
                // Add upvote, remove downvote if exists
                confession.upvotes.push(userId);
                confession.downvotes = confession.downvotes.filter(uid => uid.toString() !== userId);
            }
        } else if (type === 'down') {
            if (hasDownvoted) {
                // Remove downvote
                confession.downvotes = confession.downvotes.filter(uid => uid.toString() !== userId);
            } else {
                // Add downvote, remove upvote if exists
                confession.downvotes.push(userId);
                confession.upvotes = confession.upvotes.filter(uid => uid.toString() !== userId);
            }
        }

        // Update net score
        confession.voteScore = confession.upvotes.length - confession.downvotes.length;
        await confession.save();

        res.json({
            confessionId: confession._id,
            voteScore: confession.voteScore,
            upvotes: confession.upvotes,
            downvotes: confession.downvotes
        });
    } catch (error) {
        console.error('Vote Error:', error);
        res.status(500).json({ message: 'Error processing vote' });
    }
});


module.exports = router;
