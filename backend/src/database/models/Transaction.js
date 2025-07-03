const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

class Transaction {
  constructor(pgPool) {
    this.pool = pgPool;
  }

  async create({ userId, type, amount, description, balanceAfter }) {
    const client = await this.pool.connect();
    try {
      const transactionId = uuidv4();
      
      const query = `
        INSERT INTO transactions (transaction_id, user_id, type, amount, balance_after, description, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;
      
      const values = [transactionId, userId, type, amount, balanceAfter, description];
      const result = await client.query(query, values);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getByUserId(userId, limit = 50, offset = 0) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM transactions 
        WHERE user_id = $1 
        ORDER BY timestamp DESC 
        LIMIT $2 OFFSET $3
      `;
      const result = await client.query(query, [userId, limit, offset]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getById(transactionId) {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM transactions WHERE transaction_id = $1';
      const result = await client.query(query, [transactionId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = Transaction;