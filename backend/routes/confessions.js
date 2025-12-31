const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');

// Submit confession (Instant publish)
router.post('/', async (req, res) => {
    try {
        const { content, schoolId } = req.body;

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
router.get('/', async (req, res) => {
    try {
        const { schoolId } = req.query;
        if (!schoolId) return res.status(400).json({ message: 'School ID required' });

        const confessions = await Confession.find({ schoolId })
            .sort({ createdAt: -1 });

        res.json({ confessions });
    } catch (error) {
        console.error('Get Confessions Error:', error);
        res.status(500).json({ message: 'Server error fetching confessions' });
    }
});

module.exports = router;
