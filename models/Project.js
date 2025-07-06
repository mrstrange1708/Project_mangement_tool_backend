const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    required: true
  },
  status: {
    type: String,
    enum: ['current', 'completed'],
    default: 'current',
    required: true
  },
  start: {
    type: Date,
    required: [true, 'Start date is required']
  },
  starttime: {
    type: String,
    required: [true, 'Start time is required']
  },
  end: {
    type: Date,
    required: [true, 'End date is required']
  },
  endtime: {
    type: String,
    required: [true, 'End time is required']
  },
  deadline: {
    type: String,
    required: [true, 'Deadline is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Project', projectSchema); 