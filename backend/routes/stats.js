const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get House Cup leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const mongoose = require('mongoose');

        // Aggregate points by house
        const leaderboard = await User.aggregate([
            {
                $match: {
                    schoolId: new mongoose.Types.ObjectId(schoolId),
                    role: 'student',
                    house: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$house',
                    totalPoints: { $sum: '$points' },
                    studentCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalPoints: -1 }
            },
            {
                $project: {
                    house: '$_id',
                    totalPoints: 1,
                    studentCount: 1,
                    _id: 0
                }
            }
        ]);

        // Ensure all houses are represented (even with 0 points)
        const houses = ['Red', 'Blue', 'Green', 'Yellow'];
        const completeLeaderboard = houses.map(house => {
            const existing = leaderboard.find(h => h.house === house);
            return existing || { house, totalPoints: 0, studentCount: 0 };
        });

        // Sort by totalPoints descending
        completeLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        res.json({ leaderboard: completeLeaderboard });
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
});

module.exports = router;
