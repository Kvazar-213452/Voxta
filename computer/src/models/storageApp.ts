import keytar from 'keytar';
import { configDB } from '../config';
import crypto from 'crypto';

// ==== TOKENS ====
const ACCOUNT_TOKEN = 'sessionToken';

export async function saveToken(token: string): Promise<void> {
  await keytar.setPassword(configDB.SERVICE_NAME, ACCOUNT_TOKEN, token);
}

export async function getToken(): Promise<string | null> {
  return await keytar.getPassword(configDB.SERVICE_NAME, ACCOUNT_TOKEN);
}

export async function deleteToken(): Promise<void> {
  await keytar.deletePassword(configDB.SERVICE_NAME, ACCOUNT_TOKEN);
}

// ==== KEYS ====
const ACCOUNT_PUBLIC_KEY = 'publicKey';
const ACCOUNT_PRIVATE_KEY = 'privateKey';

export async function saveKeys(publicKey: string, privateKey: string): Promise<void> {
  await keytar.setPassword(configDB.SERVICE_NAME, ACCOUNT_PUBLIC_KEY, publicKey);

  const part1 = privateKey.slice(0, 1000);
  const part2 = privateKey.slice(1000);

  await keytar.setPassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`, part1);
  await keytar.setPassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`, part2);
}

export async function getPublicKey(): Promise<string | null> {
  return await keytar.getPassword(configDB.SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
}

export async function getPrivateKey(): Promise<string> {
  const part1 = await keytar.getPassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`);
  const part2 = await keytar.getPassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`);
  return (part1 ?? '') + (part2 ?? '');
}

export async function deleteKeys(): Promise<void> {
  await keytar.deletePassword(configDB.SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
  await keytar.deletePassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`);
  await keytar.deletePassword(configDB.SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`);
}

// ==== KEYS db ====
const ACCOUNT_KEY_TEXT = 'encryption_key';

export function generateEncryptionKey(): { password: string; salt: string } {
  const password = crypto.randomBytes(32).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  return { password, salt };
}

export async function generateKeyTextAndSave(): Promise<void> {
  const { password, salt } = generateEncryptionKey();
  const secretKeyBuffer = crypto.scryptSync(password, salt, 32);
  const secretKeyHex = secretKeyBuffer.toString('hex');

  await keytar.setPassword(configDB.SERVICE_NAME, ACCOUNT_KEY_TEXT, secretKeyHex);
}

export async function getKeyText(): Promise<Buffer> {
  const secretKeyHex = await keytar.getPassword(configDB.SERVICE_NAME, ACCOUNT_KEY_TEXT);
  if (!secretKeyHex) throw new Error('Encryption key not found in keytar');

  return Buffer.from(secretKeyHex, 'hex');
}

export async function initKeyText(): Promise<void> {
  try {
    await getKeyText();
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      await generateKeyTextAndSave();
    } else {
      throw err;
    }
  }
}