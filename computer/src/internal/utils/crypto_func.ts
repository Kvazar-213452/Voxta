import crypto from 'crypto';
import axios from 'axios';
import { saveKeys, getPublicKey, getPrivateKey } from '../models/storage_app';
import { config } from '../../config';

// ====== Генерація ключів ======
export async function generate_key(): Promise<void> {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1', // 'spki' — сучасний стандарт
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1', // 'pkcs8' — більш універсальний
      format: 'pem'
    }
  });

  await saveKeys(publicKey, privateKey);
}

// ====== Отримання публічного ключа сервера ======
export async function getPublicKey_server(): Promise<string> {
  const response = await axios.get<string>("http://localhost:3000/public_key");
  return response.data;
}

// ====== Шифрування на стороні сервера (або при передачі ключа) ======
export function encryption_msg(key: string, message: string): string {
  const encrypted = crypto.publicEncrypt(key, Buffer.from(message, 'utf8'));
  return encrypted.toString('base64');
}



export async function encryption_app(message: string): Promise<string> {
  const publicKey = await getPublicKey();
  if (!publicKey) {
    throw new Error('Public key is not available');
  }
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message, 'utf8'));
  return encrypted.toString('base64');
}

export async function decryption_app(message: Buffer): Promise<string> {
  const privateKey = await getPrivateKey();
  if (!privateKey) {
    throw new Error('Private key is not available');
  }
  const decrypted = crypto.privateDecrypt(privateKey, message);
  return decrypted.toString('utf8');
}