const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    console.log('Running database migrations...');
    
    const migrationPath = path.join(__dirname, 'migrations', '001_create_tables.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    console.log('Migrations completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };