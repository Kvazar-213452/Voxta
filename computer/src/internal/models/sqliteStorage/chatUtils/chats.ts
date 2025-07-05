import { getDatabase } from '../chats';

export function createChatTables(): void {
  const db = getDatabase();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS chat_participants (
      chatId TEXT,
      userId TEXT,
      PRIMARY KEY (chatId, userId),
      FOREIGN KEY (chatId) REFERENCES chats(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT,
      sender TEXT,
      content TEXT,
      time TEXT,
      FOREIGN KEY (chatId) REFERENCES chats(id)
    )
  `).run();
}

export function createChat(id: string): void {
  const db = getDatabase();

  db.prepare(`
    INSERT OR IGNORE INTO chats (id)
    VALUES (?)
  `).run(id);
}

function generateUniqueId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function addMessage(chatId: string, message: MsgToDb): Message {
  const db = getDatabase();
  const id = generateUniqueId();

  db.prepare(`
    INSERT INTO messages (id, chatId, sender, content, time)
    VALUES (@id, @chatId, @sender, @content, @time)
  `).run({
    id,
    chatId,
    sender: message.sender,
    content: message.content,
    time: message.time
  });

  return {
    id,
    sender: message.sender,
    content: message.content,
    time: message.time
  };
}

export function getMessagesByChatId(chatId: string): Message[] {
  const db = getDatabase();

  const messages = db.prepare(`
    SELECT id, sender, content, time
    FROM messages
    WHERE chatId = ?
    ORDER BY time ASC
  `).all(chatId);

  return messages;
}

export function getAllChatIds(): string[] {
  const db = getDatabase();

  const rows = db.prepare(`SELECT id FROM chats`).all();

  return rows.map(row => row.id);
}

