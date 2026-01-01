const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'school'],
        default: 'student'
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: function () { return this.role === 'student'; }
    },
    points: {
        type: Number,
        default: 100
    },
    house: {
        type: String,
        enum: ['Red', 'Blue', 'Green', 'Yellow']
    },
    isAlumni: {
        type: Boolean,
        default: false
    },
    clubsJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],
    unlockedNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
