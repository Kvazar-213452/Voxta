import path from 'path';
import { app } from 'electron';
import Database from 'better-sqlite3';

let db: Database.Database;

export function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'voxta.db');
  db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      time TEXT,
      avatar TEXT,
      desc TEXT,
      chats TEXT
    )
  `).run();
}

export function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized!');
  return db;
}
