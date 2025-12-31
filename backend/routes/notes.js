const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Upload a new note
router.post('/upload', auth, async (req, res) => {
    try {
        const { title, subject, pdfUrl, price } = req.body;
        const authorId = req.user.id;
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const note = new Note({
            title,
            subject,
            pdfUrl,
            price,
            author: authorId,
            schoolId
        });

        await note.save();

        const populatedNote = await Note.findById(note._id)
            .populate('author', 'name email isAlumni');

        // Create Broadcast Notification
        const Notification = require('../models/Notification');
        await new Notification({
            userId: null, // Broadcast
            schoolId,
            message: `New Study Material: "${title}" in ${subject}. Access the Vault!`,
            type: 'system'
        }).save();

        res.status(201).json({
            message: 'Note uploaded successfully!',
            note: populatedNote
        });
    } catch (error) {
        console.error('Upload Note Error:', error);
        res.status(500).json({ message: 'Server error uploading note', error: error.message });
    }
});

// Get all notes for a school
router.get('/', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const notes = await Note.find({ schoolId })
            .populate('author', 'name email isAlumni')
            .sort({ createdAt: -1 });

        res.json({ notes });
    } catch (error) {
        console.error('Get Notes Error:', error);
        res.status(500).json({ message: 'Server error fetching notes' });
    }
});

// Buy/Unlock a note
router.post('/buy/:id', auth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const buyerId = req.user.id;

        // Get the note
        const note = await Note.findById(noteId).populate('author');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Strict Isolation
        const userSchoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;
        if (note.schoolId.toString() !== userSchoolId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to this note' });
        }

        // Get the buyer
        const buyer = await User.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Check if already unlocked
        if (buyer.unlockedNotes.includes(noteId)) {
            return res.status(400).json({ message: 'You already own this note' });
        }

        // Check if buyer is the author
        if (note.author._id.toString() === buyerId) {
            return res.status(400).json({ message: 'You cannot buy your own note' });
        }

        // Check if buyer has enough points
        if (buyer.points < note.price) {
            return res.status(400).json({
                message: `Insufficient points. You need ${note.price} points but only have ${buyer.points}`
            });
        }

        // Perform transaction
        // 1. Deduct points from buyer
        buyer.points -= note.price;
        buyer.unlockedNotes.push(noteId);
        await buyer.save();

        // 2. Add points to author
        await User.findByIdAndUpdate(note.author._id, {
            $inc: { points: note.price }
        });

        // 3. Add buyer to purchasers
        note.purchasers.push(buyerId);
        await note.save();

        // 4. Automated Message from School to Buyer
        try {
            const Conversation = require('../models/Conversation');
            const Message = require('../models/Message');

            // Find or create conversation with the school
            let conversation = await Conversation.findOne({
                participants: { $all: [buyerId, note.schoolId] }
            });

            if (!conversation) {
                conversation = new Conversation({
                    participants: [buyerId, note.schoolId]
                });
                await conversation.save();
            }

            const welcomeMsg = `🎉 **Success! Note Unlocked!** 📚\n\nHi ${buyer.name}! You have successfully unlocked "${note.title}".\n\n🔗 **Access Link:** ${note.pdfUrl}\n\nHappy studying and good luck with your exams! 🚀✨`;

            const newMessage = new Message({
                conversationId: conversation._id,
                sender: note.schoolId, // Sent by the school admin
                content: welcomeMsg
            });
            await newMessage.save();

            await Conversation.findByIdAndUpdate(conversation._id, {
                lastMessage: welcomeMsg,
                updatedAt: Date.now()
            });
        } catch (err) {
            console.error('Auto-message error:', err);
            // Don't fail the whole request if message fails
        }

        res.json({
            message: `Note unlocked successfully! ${note.price} points deducted.`,
            remainingPoints: buyer.points
        });
    } catch (error) {
        console.error('Buy Note Error:', error);
        res.status(500).json({ message: 'Server error purchasing note' });
    }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, pdfUrl, price } = req.body;
        const authorId = req.user.id;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Security check: Only author can edit
        if (note.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Unauthorized to edit this note' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, subject, pdfUrl, price },
            { new: true }
        ).populate('author', 'name email isAlumni');

        res.json({ message: 'Note updated successfully!', note: updatedNote });
    } catch (error) {
        console.error('Update Note Error:', error);
        res.status(500).json({ message: 'Server error updating note' });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.user.id;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Security check: Only author can delete
        if (note.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Unauthorized to delete this note' });
        }

        await Note.findByIdAndDelete(id);
        res.json({ message: 'Note removed from vault.' });
    } catch (error) {
        console.error('Delete Note Error:', error);
        res.status(500).json({ message: 'Server error deleting note' });
    }
});

module.exports = router;
