import { getDatabase } from '../chats';

export function createChatTables() {
  const db = getDatabase();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      type TEXT,
      avatar TEXT,
      name TEXT,
      createdAt TEXT,
      desc TEXT,
      owner TEXT
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

export function createChat(chat: {
  id: string;
  type: string;
  avatar: string;
  name: string;
  createdAt: string;
  desc: string;
  owner: string;
  participants: string[];
}) {
  const db = getDatabase();

  const insertChat = db.prepare(`
    INSERT INTO chats (id, type, avatar, name, createdAt, desc, owner)
    VALUES (@id, @type, @avatar, @name, @createdAt, @desc, @owner)
  `);

  const insertParticipant = db.prepare(`
    INSERT INTO chat_participants (chatId, userId)
    VALUES (?, ?)
  `);

  const transaction = db.transaction(() => {
    insertChat.run(chat);
    for (const userId of chat.participants) {
      insertParticipant.run(chat.id, userId);
    }
  });

  transaction();
}


export function addMessage(chatId: string, message: {
  id: string;
  sender: string;
  content: string;
  time: string;
}) {
  const db = getDatabase();

  db.prepare(`
    INSERT INTO messages (id, chatId, sender, content, time)
    VALUES (@id, @chatId, @sender, @content, @time)
  `).run({
    ...message,
    chatId
  });
}


export function getMessagesByChatId(chatId: string): any[] {
  const db = getDatabase();

  const messages = db.prepare(`
    SELECT id, sender, content, time
    FROM messages
    WHERE chatId = ?
    ORDER BY time ASC
  `).all(chatId);

  return messages;
}
