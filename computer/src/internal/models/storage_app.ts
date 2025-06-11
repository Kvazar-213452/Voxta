import keytar from 'keytar';
import { config } from '../../config';

// ==== CONFIG ====
const SERVICE_NAME: string = config.SERVICE_NAME;

// ==== TOKENS ====
const ACCOUNT_TOKEN = 'sessionToken';

export async function saveToken(token: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_TOKEN, token);
}

export async function getToken(): Promise<string | null> {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_TOKEN);
}

export async function deleteToken(): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_TOKEN);
}

// ==== KEYS ====
const ACCOUNT_PUBLIC_KEY = 'publicKey';
const ACCOUNT_PRIVATE_KEY = 'privateKey';

export async function saveKeys(publicKey: string, privateKey: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY, publicKey);

  const part1 = privateKey.slice(0, 1000);
  const part2 = privateKey.slice(1000);

  await keytar.setPassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`, part1);
  await keytar.setPassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`, part2);
}

export async function getPublicKey(): Promise<string | null> {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
}

export async function getPrivateKey(): Promise<string> {
  const part1 = await keytar.getPassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`);
  const part2 = await keytar.getPassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`);
  return (part1 ?? '') + (part2 ?? '');
}

export async function deleteKeys(): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
  await keytar.deletePassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_1`);
  await keytar.deletePassword(SERVICE_NAME, `${ACCOUNT_PRIVATE_KEY}_2`);
}
