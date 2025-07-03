const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const Video = require('../database/models/Video');
const auth = require('../middleware/auth');
const videoProcessor = require('../services/videoProcessor');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: process.env.UPLOAD_DIR || './uploads',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// Validation schemas
const processLinkSchema = Joi.object({
  url: Joi.string().uri().required(),
  platform: Joi.string().valid('tiktok', 'youtube', 'reels').required(),
  startTime: Joi.number().min(0).optional(),
  endTime: Joi.number().min(0).optional()
});

// Process video from URL
router.post('/process/link', auth, async (req, res) => {
  try {
    const { error, value } = processLinkSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { url, platform, startTime, endTime } = value;
    const userId = req.user.userId;

    // Check user credits
    if (req.user.credits < 1) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    // Create video record
    const videoId = uuidv4();
    const video = new Video({
      videoId,
      userId,
      sourceUrl: url,
      platform,
      status: 'queued',
      metadata: {
        createdFrom: 'link'
      },
      processingDetails: {
        clipStartTime: startTime,
        clipEndTime: endTime
      }
    });

    await video.save();

    // Queue video processing job
    await videoProcessor.queueProcessing({
      videoId,
      userId,
      sourceUrl: url,
      platform,
      startTime,
      endTime
    });

    logger.info(`Video processing queued: ${videoId} for user: ${userId}`);

    res.status(202).json({
      message: 'Video processing started',
      videoId,
      status: 'queued'
    });
  } catch (error) {
    logger.error('Process link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process uploaded video file
router.post('/process/upload', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file required' });
    }

    const { platform = 'custom', startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Check user credits
    if (req.user.credits < 1) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    // Create video record
    const videoId = uuidv4();
    const video = new Video({
      videoId,
      userId,
      platform,
      status: 'queued',
      metadata: {
        createdFrom: 'upload',
        originalFilename: req.file.originalname,
        fileSize: req.file.size
      },
      processingDetails: {
        clipStartTime: startTime ? parseFloat(startTime) : undefined,
        clipEndTime: endTime ? parseFloat(endTime) : undefined
      }
    });

    await video.save();

    // Queue video processing job
    await videoProcessor.queueProcessing({
      videoId,
      userId,
      filePath: req.file.path,
      platform,
      startTime: startTime ? parseFloat(startTime) : undefined,
      endTime: endTime ? parseFloat(endTime) : undefined
    });

    logger.info(`Video upload processing queued: ${videoId} for user: ${userId}`);

    res.status(202).json({
      message: 'Video processing started',
      videoId,
      status: 'queued'
    });
  } catch (error) {
    logger.error('Process upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get video processing status
router.get('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const video = await Video.findOne({ videoId: id, userId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      videoId: video.videoId,
      status: video.status,
      platform: video.platform,
      metadata: video.metadata,
      processingDetails: video.processingDetails,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt
    });
  } catch (error) {
    logger.error('Get status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download processed video
router.get('/:id/download', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const video = await Video.findOne({ videoId: id, userId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.status !== 'completed') {
      return res.status(400).json({ error: 'Video processing not completed' });
    }

    if (!video.processedUrl) {
      return res.status(404).json({ error: 'Processed video not available' });
    }

    // Generate signed URL for download (if using S3)
    const downloadUrl = await videoProcessor.generateDownloadUrl(video.processedUrl);

    res.json({
      downloadUrl,
      expiresIn: 3600 // 1 hour
    });
  } catch (error) {
    logger.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete video
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const video = await Video.findOne({ videoId: id, userId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Delete from storage
    if (video.processedUrl) {
      await videoProcessor.deleteFromStorage(video.processedUrl);
    }

    // Delete from database
    await Video.deleteOne({ videoId: id, userId });

    logger.info(`Video deleted: ${id} by user: ${userId}`);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    logger.error('Delete video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;