const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../database/models/User');
const { getPgPool } = require('../database/connections');
const logger = require('../utils/logger');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const userModel = new User(getPgPool());

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await userModel.create({ email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        credits: user.credits,
        subscription: user.subscription
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const userModel = new User(getPgPool());

    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await userModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await userModel.updateLastLogin(user.user_id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        credits: user.credits,
        subscription: user.subscription
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userModel = new User(getPgPool());
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const newToken = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token: newToken });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userModel = new User(getPgPool());
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        userId: user.user_id,
        email: user.email,
        credits: user.credits,
        subscription: user.subscription,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;