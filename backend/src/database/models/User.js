const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(pgPool) {
    this.pool = pgPool;
  }

  async create({ email, password, subscription = { type: 'free' } }) {
    const client = await this.pool.connect();
    try {
      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(password, 12);
      
      const query = `
        INSERT INTO users (user_id, email, password_hash, credits, subscription, created_at, last_login)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING user_id, email, credits, subscription, created_at
      `;
      
      const values = [userId, email, passwordHash, 10, JSON.stringify(subscription)];
      const result = await client.query(query, values);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findByEmail(email) {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findById(userId) {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE user_id = $1';
      const result = await client.query(query, [userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateCredits(userId, credits) {
    const client = await this.pool.connect();
    try {
      const query = `
        UPDATE users 
        SET credits = $2, updated_at = NOW()
        WHERE user_id = $1
        RETURNING credits
      `;
      const result = await client.query(query, [userId, credits]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateLastLogin(userId) {
    const client = await this.pool.connect();
    try {
      const query = 'UPDATE users SET last_login = NOW() WHERE user_id = $1';
      await client.query(query, [userId]);
    } finally {
      client.release();
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;