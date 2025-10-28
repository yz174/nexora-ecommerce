import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database path from environment or use default
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'database.sqlite');

let db = null;

/**
 * Initialize database connection and create tables
 */
export function initDatabase() {
  try {
    db = new Database(dbPath, { verbose: console.log });
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    console.log(`Database connected: ${dbPath}`);
    
    // Create cart_items table
    createTables();
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}

/**
 * Create database tables
 */
function createTables() {
  try {
    const createCartItemsTable = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL DEFAULT 'mock-user-001',
        product_id TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0),
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `;
    
    db.exec(createCartItemsTable);
    
    // Create index for user_id for better query performance
    const createUserIdIndex = `
      CREATE INDEX IF NOT EXISTS idx_user_id ON cart_items(user_id)
    `;
    
    db.exec(createUserIdIndex);
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw new Error(`Failed to create tables: ${error.message}`);
  }
}

/**
 * Get database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

export default {
  initDatabase,
  getDatabase,
  closeDatabase
};
