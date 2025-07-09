import crypto from 'crypto';
import fs from 'fs';

export function generateKey() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'pkcs1', // 'spki' — сучасний стандарт, 'pkcs1' — простіше
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1', // 'pkcs8' — більш універсальний, але для початку ok так
        format: 'pem'
    }
    });

    fs.writeFileSync('private_key.pem', privateKey);
    fs.writeFileSync('public_key.pem', publicKey);
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

// ======= encryption_server ENDPOINT ===========
export async function encryptionServer(message: string): Promise<EncryptedData> {
  const publicKey = fs.readFileSync('public_key.pem', 'utf8');
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

// ======= decryption_server ENDPOINT ===========
export async function decryptionServer(encryptedData: EncryptedData): Promise<string> {
  const privateKey = fs.readFileSync('private_key.pem', 'utf8');
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
