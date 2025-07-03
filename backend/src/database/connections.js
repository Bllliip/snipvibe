const { Pool } = require('pg');
const mongoose = require('mongoose');
const redis = require('redis');
const logger = require('../utils/logger');

let pgPool;
let redisClient;

// PostgreSQL connection
async function connectPostgres() {
  try {
    pgPool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    await pgPool.query('SELECT NOW()');
    logger.info('PostgreSQL connected successfully');
    return pgPool;
  } catch (error) {
    logger.error('PostgreSQL connection failed:', error);
    throw error;
  }
}

// MongoDB connection
async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
}

// Redis connection
async function connectRedis() {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
}

module.exports = {
  connectPostgres,
  connectMongoDB,
  connectRedis,
  getPgPool: () => pgPool,
  getRedisClient: () => redisClient
};