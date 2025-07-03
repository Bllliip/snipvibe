const express = require('express');
const Stripe = require('stripe');
const User = require('../database/models/User');
const Transaction = require('../database/models/Transaction');
const Video = require('../database/models/Video');
const auth = require('../middleware/auth');
const { getPgPool } = require('../database/connections');
const logger = require('../utils/logger');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get user credits
router.get('/credits', auth, async (req, res) => {
  try {
    const userModel = new User(getPgPool());
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      credits: user.credits,
      subscription: user.subscription
    });
  } catch (error) {
    logger.error('Get credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchase credits
router.post('/credits/purchase', auth, async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    const userModel = new User(getPgPool());
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate price (e.g., $0.10 per credit)
    const pricePerCredit = 10; // cents
    const totalPrice = amount * pricePerCredit;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId: user.user_id,
        credits: amount.toString()
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update user credits
      const newCredits = user.credits + amount;
      await userModel.updateCredits(user.user_id, newCredits);

      // Record transaction
      const transactionModel = new Transaction(getPgPool());
      await transactionModel.create({
        userId: user.user_id,
        type: 'purchase',
        amount: amount,
        balanceAfter: newCredits,
        description: `Purchased ${amount} credits`
      });

      logger.info(`Credits purchased: ${amount} for user: ${user.user_id}`);

      res.json({
        message: 'Credits purchased successfully',
        credits: newCredits,
        transactionId: paymentIntent.id
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    logger.error('Purchase credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user videos
router.get('/videos', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Video.countDocuments({ userId: req.user.userId });

    res.json({
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user subscription info
router.get('/subscription', auth, async (req, res) => {
  try {
    const userModel = new User(getPgPool());
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactionModel = new Transaction(getPgPool());
    const recentTransactions = await transactionModel.getByUserId(req.user.userId, 10);

    res.json({
      subscription: user.subscription,
      credits: user.credits,
      recentTransactions
    });
  } catch (error) {
    logger.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;