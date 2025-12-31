const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Create/Fetch Conversation
router.post('/conversation', async (req, res) => {
    try {
        const { participant1, participant2 } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [participant1, participant2] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [participant1, participant2]
            });
            await conversation.save();
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating conversation' });
    }
});

// Get Conversations for a user
router.get('/conversations/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.params.userId
        }).populate('participants', 'name email').sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching conversations' });
    }
});

// Get Messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).populate('sender', 'name').sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

module.exports = router;
