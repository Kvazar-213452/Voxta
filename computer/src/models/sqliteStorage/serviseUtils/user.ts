import { getDatabase } from '../servise';
import { encryptText, decryptText } from '../../../utils/crypto/cryptoFunc';

export async function saveUser(user: User): Promise<void> {
  getDatabase().prepare(`DELETE FROM users`).run();

  const stmt = getDatabase().prepare(`
    INSERT INTO users (id, name, password, time, avatar, desc, chats)
    VALUES (@id, @name, @password, @time, @avatar, @desc, @chats)
  `);

  stmt.run({
    id: user.id,
    name: user.name,
    password: await encryptText(user.password),
    time: user.time,
    avatar: user.avatar,
    desc: user.desc,
    chats: await encryptText(JSON.stringify(user.chats))
  });
}

export async function getUser(): Promise<User | null> {
  try {
    const row = getDatabase().prepare(`SELECT * FROM users LIMIT 1`).get();

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      password: await decryptText(row.password),
      time: row.time,
      avatar: row.avatar,
      desc: row.desc,
      chats: JSON.parse(await decryptText(row.chats ?? '[]'))
    };
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

export function deleteUser(): void {
  getDatabase().prepare(`DELETE FROM users`).run();
}
