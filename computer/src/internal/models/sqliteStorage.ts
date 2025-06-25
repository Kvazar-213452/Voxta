import { getDatabase } from './sqlite';

// ======= user =======

export function saveUser(user: {
  _id: string;
  name: string;
  password: string;
  time: string;
  avatar: string;
  desc: string;
  chats: string[];
}) {
  getDatabase().prepare(`DELETE FROM users`).run();

  const stmt = getDatabase().prepare(`
    INSERT INTO users (_id, name, password, time, avatar, desc, chats)
    VALUES (@_id, @name, @password, @time, @avatar, @desc, @chats)
  `);

  stmt.run({
    ...user,
    chats: JSON.stringify(user.chats)
  });
}

export function getUser() {
  const row = getDatabase().prepare(`SELECT * FROM users LIMIT 1`).get();

  if (!row) return null;

  return {
    _id: row._id,
    name: row.name,
    password: row.password,
    time: row.time,
    avatar: row.avatar,
    desc: row.desc,
    chats: JSON.parse(row.chats ?? '[]'),
  };
}

export function deleteUser() {
  getDatabase().prepare(`DELETE FROM users`).run();
}