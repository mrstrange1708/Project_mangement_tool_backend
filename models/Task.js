const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  reminderTime: { type: Date, required: true },
  userEmail: { type: String, required: true },
  reminderSent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema); 