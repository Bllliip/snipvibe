const express = require('express');
const Stripe = require('stripe');
const User = require('../database/models/User');
const Transaction = require('../database/models/Transaction');
const { getPgPool } = require('../database/connections');
const logger = require('../utils/logger');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook handler
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handlePaymentSuccess(paymentIntent) {
  const { userId, credits } = paymentIntent.metadata;
  
  if (!userId || !credits) {
    logger.error('Missing metadata in payment intent:', paymentIntent.id);
    return;
  }

  const userModel = new User(getPgPool());
  const user = await userModel.findById(userId);

  if (!user) {
    logger.error('User not found for payment:', userId);
    return;
  }

  const creditAmount = parseInt(credits);
  const newCredits = user.credits + creditAmount;
  
  await userModel.updateCredits(userId, newCredits);

  const transactionModel = new Transaction(getPgPool());
  await transactionModel.create({
    userId,
    type: 'purchase',
    amount: creditAmount,
    balanceAfter: newCredits,
    description: `Purchased ${creditAmount} credits via Stripe`
  });

  logger.info(`Payment processed: ${creditAmount} credits for user: ${userId}`);
}

async function handlePaymentFailure(paymentIntent) {
  const { userId } = paymentIntent.metadata;
  logger.error(`Payment failed for user: ${userId}, payment intent: ${paymentIntent.id}`);
}

module.exports = router;