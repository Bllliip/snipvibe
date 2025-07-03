const Queue = require('bull');
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Video = require('../database/models/Video');
const User = require('../database/models/User');
const Transaction = require('../database/models/Transaction');
const { getPgPool, getRedisClient } = require('../database/connections');
const aiService = require('./aiService');
const logger = require('../utils/logger');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure FFmpeg paths if specified
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}
if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
}

// Create processing queue
const videoQueue = new Queue('video processing', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Queue video processing job
async function queueProcessing(jobData) {
  const job = await videoQueue.add('process-video', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 10,
    removeOnFail: 5
  });

  logger.info(`Video processing job queued: ${job.id}`);
  return job;
}

// Process video queue jobs
videoQueue.process('process-video', async (job) => {
  const { videoId, userId, sourceUrl, filePath, platform, startTime, endTime } = job.data;
  
  try {
    logger.info(`Processing video: ${videoId}`);
    
    // Update status to processing
    await Video.findOneAndUpdate(
      { videoId },
      { 
        status: 'processing',
        'processingDetails.startTime': new Date()
      }
    );

    let inputPath;
    let tempFiles = [];

    // Download video if URL provided
    if (sourceUrl) {
      inputPath = await downloadVideo(sourceUrl, videoId);
      tempFiles.push(inputPath);
    } else {
      inputPath = filePath;
    }

    // Get video metadata
    const metadata = await getVideoMetadata(inputPath);
    
    // Determine clip times
    const clipTimes = await determineClipTimes(inputPath, metadata, startTime, endTime, platform);
    
    // Process video
    const outputPath = await processVideo(inputPath, clipTimes, platform, videoId);
    tempFiles.push(outputPath);

    // Upload to S3
    const s3Url = await uploadToS3(outputPath, videoId);

    // Generate AI metadata
    const aiMetadata = await aiService.generateMetadata(outputPath, platform);

    // Update video record
    await Video.findOneAndUpdate(
      { videoId },
      {
        status: 'completed',
        processedUrl: s3Url,
        duration: clipTimes.duration,
        'metadata.title': aiMetadata.title,
        'metadata.description': aiMetadata.description,
        'metadata.hashtags': aiMetadata.hashtags,
        'processingDetails.endTime': new Date(),
        'processingDetails.clipStartTime': clipTimes.start,
        'processingDetails.clipEndTime': clipTimes.end
      }
    );

    // Deduct credits
    await deductUserCredits(userId);

    // Clean up temp files
    await cleanupFiles(tempFiles);

    logger.info(`Video processing completed: ${videoId}`);
    
  } catch (error) {
    logger.error(`Video processing failed: ${videoId}`, error);
    
    await Video.findOneAndUpdate(
      { videoId },
      {
        status: 'failed',
        'processingDetails.endTime': new Date(),
        'processingDetails.errorMessage': error.message
      }
    );

    throw error;
  }
});

// Download video from URL
async function downloadVideo(url, videoId) {
  const outputPath = path.join(process.env.UPLOAD_DIR || './uploads', `${videoId}_source.mp4`);
  
  if (ytdl.validateURL(url)) {
    // YouTube download
    const stream = ytdl(url, { quality: 'highest' });
    const writeStream = require('fs').createWriteStream(outputPath);
    
    return new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);
    });
  } else {
    // Generic video download
    return new Promise((resolve, reject) => {
      ffmpeg(url)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }
}

// Get video metadata
async function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
}

// Determine optimal clip times
async function determineClipTimes(inputPath, metadata, startTime, endTime, platform) {
  const videoDuration = metadata.format.duration;
  const maxDuration = getMaxDurationForPlatform(platform);
  
  let clipStart = startTime || 0;
  let clipEnd = endTime || Math.min(videoDuration, clipStart + maxDuration);
  
  // If no specific times provided, use AI to find best segment
  if (!startTime && !endTime) {
    const aiClipTimes = await aiService.findBestClip(inputPath, maxDuration);
    clipStart = aiClipTimes.start;
    clipEnd = aiClipTimes.end;
  }
  
  return {
    start: clipStart,
    end: clipEnd,
    duration: clipEnd - clipStart
  };
}

// Get maximum duration for platform
function getMaxDurationForPlatform(platform) {
  const durations = {
    'tiktok': 60,
    'youtube': 60,
    'reels': 60,
    'custom': 60
  };
  return durations[platform] || 60;
}

// Process video with FFmpeg
async function processVideo(inputPath, clipTimes, platform, videoId) {
  const outputPath = path.join(process.env.UPLOAD_DIR || './uploads', `${videoId}_processed.mp4`);
  
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .seekInput(clipTimes.start)
      .duration(clipTimes.duration)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4');

    // Platform-specific settings
    if (platform === 'tiktok' || platform === 'reels') {
      command = command
        .size('1080x1920')
        .aspect('9:16');
    } else if (platform === 'youtube') {
      command = command
        .size('1920x1080')
        .aspect('16:9');
    }

    command
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

// Upload to S3
async function uploadToS3(filePath, videoId) {
  const fileContent = await fs.readFile(filePath);
  const key = `videos/${videoId}.mp4`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: 'video/mp4'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

// Generate signed download URL
async function generateDownloadUrl(s3Url) {
  const key = s3Url.split('/').pop();
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `videos/${key}`,
    Expires: 3600 // 1 hour
  };

  return s3.getSignedUrl('getObject', params);
}

// Delete from S3
async function deleteFromStorage(s3Url) {
  const key = s3Url.split('/').pop();
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `videos/${key}`
  };

  await s3.deleteObject(params).promise();
}

// Deduct user credits
async function deductUserCredits(userId) {
  const userModel = new User(getPgPool());
  const user = await userModel.findById(userId);
  
  if (user.credits > 0) {
    const newCredits = user.credits - 1;
    await userModel.updateCredits(userId, newCredits);
    
    const transactionModel = new Transaction(getPgPool());
    await transactionModel.create({
      userId,
      type: 'consumption',
      amount: -1,
      balanceAfter: newCredits,
      description: 'Video processing credit consumed'
    });
  }
}

// Clean up temporary files
async function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn(`Failed to delete temp file: ${filePath}`, error);
    }
  }
}

module.exports = {
  queueProcessing,
  generateDownloadUrl,
  deleteFromStorage
};