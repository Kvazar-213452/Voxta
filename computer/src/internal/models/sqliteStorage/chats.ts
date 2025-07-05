import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { createChatTables } from './chatUtils/chats';
import { app } from 'electron';

let dbInstance: Database.Database | null = null;

const DB_PATH = path.join(app.getPath('userData'), 'chat_database.db');

export function initDatabaseChats() {
  const dbExists = fs.existsSync(DB_PATH);

  dbInstance = new Database(DB_PATH);

  if (!dbExists) {
    console.log('chat_database.db');
    createChatTables();
  } else {
    console.log('good');
  }
}

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    throw new Error('erro none db');
  }
  return dbInstance;
}
