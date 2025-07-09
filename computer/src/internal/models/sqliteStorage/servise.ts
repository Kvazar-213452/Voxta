import path from 'path';
import { app } from 'electron';
import Database from 'better-sqlite3';
import { defaultSettings } from '../../../config';

let db: Database.Database;

export function initDatabase(): void {
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

  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      darkMode INTEGER DEFAULT 1,
      browserNotifications INTEGER DEFAULT 1,
      doNotDisturb INTEGER DEFAULT 0,
      language TEXT DEFAULT 'uk',
      readReceipts INTEGER DEFAULT 1,
      onlineStatus INTEGER DEFAULT 1
    )
  `).run();

  const rowCount = db.prepare(`SELECT COUNT(*) AS count FROM settings`).get().count;

  if (rowCount === 0) {
    db.prepare(`
      INSERT INTO settings (
        darkMode,
        browserNotifications,
        doNotDisturb,
        language,
        readReceipts,
        onlineStatus
      ) VALUES (
        @darkMode,
        @browserNotifications,
        @doNotDisturb,
        @language,
        @readReceipts,
        @onlineStatus
      )
    `).run(defaultSettings);
  }
}

export function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized!');
  return db;
}
