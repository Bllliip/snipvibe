const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const { getPgPool } = require('../database/connections');
const logger = require('../utils/logger');

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userModel = new User(getPgPool());
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      userId: user.user_id,
      email: user.email,
      credits: user.credits,
      subscription: user.subscription
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = auth;