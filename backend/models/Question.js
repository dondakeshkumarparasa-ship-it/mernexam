const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  tag: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  concept: { type: String },
  shortcut: { type: String },
  source: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  takeaway: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
