import crypto, { CipherGCM, DecipherGCM } from 'crypto';
import axios from 'axios';
import { saveKeys, getPublicKey, getPrivateKey, getKeyText } from '../../models/storageApp';
import { configCrypto } from '../../config';

export async function generateKey(): Promise<void> {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    }
  });

  await saveKeys(publicKey, privateKey);
}

export async function getPublicKeyServer(): Promise<string> {
  const response = await axios.get<string>("http://localhost:4001/public_key_pc");
  return response.data;
}

// ======= encryption_msg ENDPOINT ===========
export function encryptionMsg(publicRsaKey: string, message: string): { key: string; data: string } {
  const aesKey = crypto.randomBytes(32);
  
  const nonce = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, nonce);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  const encryptedKeyBuffer = crypto.publicEncrypt({
    key: publicRsaKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  }, aesKey);
  const encryptedKey = encryptedKeyBuffer.toString('base64');

  const data = nonce.toString('base64') + '.' + authTag.toString('base64') + '.' + encrypted;

  return {
    key: encryptedKey,
    data: data,
  };
}

// ======= decryption_app ENDPOINT ===========
export async function decryptionApp(encryptedData: any): Promise<string> {
  const privateKey = await getPrivateKey();
  if (!privateKey) {
    throw new Error('Private key is not available');
  }

  const aesKey = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  }, Buffer.from(encryptedData.key, 'base64'));

  const parts = encryptedData.data.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const nonce = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const encryptedMessage = parts[2];

  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, nonce);
  decipher.setAuthTag(authTag);
  
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
