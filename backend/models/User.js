const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  suspended: { type: Boolean, default: false },
  bookmarks: [{ type: String }], // Array of Question IDs
  history: [{
    questionId: { type: String, required: true },
    result: { type: Boolean, required: true },
    responseTime: { type: Number, required: true },
    selectedIdx: { type: Number, required: true },
    timestamp: { type: Number, default: () => Date.now() }
  }],
  revisions: [{
    questionId: { type: String, required: true },
    nextReviewTimestamp: { type: Number, required: true },
    intervalLevel: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
