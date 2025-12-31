const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('School', schoolSchema);
