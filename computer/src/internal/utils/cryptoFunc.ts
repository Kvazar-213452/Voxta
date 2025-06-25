import crypto from 'crypto';
import axios from 'axios';
import { saveKeys, getPublicKey, getPrivateKey } from '../models/storageApp';
import { config } from '../../config';

export interface EncryptedData {
  key: string;
  data: string;
}

export async function generateKey(): Promise<void> {
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

export async function getPublicKeyServer(): Promise<string> {
  const response = await axios.get<string>("http://localhost:3000/public_key");
  return response.data;
}

// ======= encryption_msg ENDPOINT ===========
export function encryptionMsg(publicRsaKey: string, message: string): { key: string; data: string } {
  const aesKey = crypto.randomBytes(32);

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const encryptedKeyBuffer = crypto.publicEncrypt(publicRsaKey, aesKey);
  const encryptedKey = encryptedKeyBuffer.toString('base64');

  const data = iv.toString('base64') + '.' + encrypted;

  return {
    key: encryptedKey,
    data: data,
  };
}

// ======= encryption_app ENDPOINT ===========
export async function encryptionApp(message: string): Promise<EncryptedData> {
  const publicKey = await getPublicKey();
  if (!publicKey) {
    throw new Error('Public key is not available');
  }

  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const encryptedKeyBuffer = crypto.publicEncrypt(publicKey, aesKey);
  const encryptedKey = encryptedKeyBuffer.toString('base64');

  const data = iv.toString('base64') + '.' + encrypted;

  return {
    key: encryptedKey,
    data: data,
  };
}

// ======= decryption_app ENDPOINT ===========
export async function decryptionApp(encryptedData: EncryptedData): Promise<string> {
  const privateKey = await getPrivateKey();

  if (!privateKey) {
    throw new Error('Private key is not available');
  }

  const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData.key, 'base64'));

  const [ivBase64, encryptedMessage] = encryptedData.data.split('.');
  if (!ivBase64 || !encryptedMessage) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(ivBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
