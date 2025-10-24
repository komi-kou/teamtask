const mongoose = require('mongoose');

const sharedDataSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'tasks', 
      'projects', 
      'leads', 
      'meetings', 
      'activities', 
      'sales', 
      'team_members',
      'service_materials',
      'documents'
    ]
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  history: [{
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changes: mongoose.Schema.Types.Mixed
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for efficient queries
sharedDataSchema.index({ teamId: 1, type: 1 });

// Update version and timestamp on save
sharedDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('data')) {
    this.version += 1;
  }
  next();
});

module.exports = mongoose.model('SharedData', sharedDataSchema);