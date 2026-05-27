const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  schemaMarkup: { type: String } // Stringified JSON-LD Structured Schema
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
