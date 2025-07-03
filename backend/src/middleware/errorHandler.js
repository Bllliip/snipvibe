const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation error', details: errors });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }

  if (err.message === 'Only video files are allowed') {
    return res.status(400).json({ error: 'Only video files are allowed' });
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
}

module.exports = errorHandler;