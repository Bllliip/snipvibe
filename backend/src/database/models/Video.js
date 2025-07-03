const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  sourceUrl: {
    type: String,
    required: false
  },
  processedUrl: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: false
  },
  platform: {
    type: String,
    enum: ['tiktok', 'youtube', 'reels', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued'
  },
  metadata: {
    title: String,
    description: String,
    hashtags: [String],
    createdFrom: {
      type: String,
      enum: ['link', 'upload', 'ai'],
      required: true
    },
    originalFilename: String,
    fileSize: Number,
    thumbnailUrl: String
  },
  processingDetails: {
    startTime: Date,
    endTime: Date,
    errorMessage: String,
    clipStartTime: Number,
    clipEndTime: Number
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index for efficient queries
videoSchema.index({ userId: 1, createdAt: -1 });
videoSchema.index({ status: 1 });
videoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Video', videoSchema);