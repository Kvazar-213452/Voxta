import crypto, { CipherGCM, DecipherGCM } from 'crypto';
import axios from 'axios';
import { saveKeys, getPublicKey, getPrivateKey, getKeyText } from '../models/storageApp';
import { configCrypto } from '../config';

export async function generateKey(): Promise<void> {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",      // spki — це сучасний стандарт для публічного ключа (X.509)
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",     // pkcs8 — більш універсальний формат приватного ключа
      format: "pem"
      // можна додати cipher та passphrase для шифрування ключа
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


  const encryptedKeyBuffer = crypto.publicEncrypt({
    key: publicRsaKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, aesKey);
  
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

  const aesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedData.key, 'base64')
  );

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

// ======= msg_bd_sql ENDPOINT ===========

export async function encryptText(text: string): Promise<string> {
  const SECRET_KEY = await getKeyText();

  const iv = crypto.randomBytes(configCrypto.IV_LENGTH);
  const cipher = crypto.createCipheriv(configCrypto.ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function decryptText(data: string): Promise<string> {
  const SECRET_KEY = await getKeyText();

  const [ivHex, encryptedHex] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(configCrypto.ALGORITHM, SECRET_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}
