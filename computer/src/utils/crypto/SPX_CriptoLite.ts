import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import axios from 'axios';
import { getSocketGlobal } from '../../services/chat/chatController';

let key: any;

export interface EncryptedPacket {
  ephemeralPubKey: string; // base64
  nonce: string;
  ciphertext: string;
}

export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

// AES-GCM симуляція через NaCl box
export function fastEncrypt(message: string, recipientPubKeyB64: string): { packet: EncryptedPacket, ephemeralPrivKey: string } {
  const recipientPubKey = naclUtil.decodeBase64(recipientPubKeyB64);
  const ephemeral = nacl.box.keyPair();

  const nonce = nacl.randomBytes(24);
  const messageBytes = naclUtil.decodeUTF8(message);
  const sharedKey = nacl.box.before(recipientPubKey, ephemeral.secretKey);
  const ciphertext = nacl.box.after(messageBytes, nonce, sharedKey);

  return {
    packet: {
      ephemeralPubKey: naclUtil.encodeBase64(ephemeral.publicKey),
      nonce: naclUtil.encodeBase64(nonce),
      ciphertext: naclUtil.encodeBase64(ciphertext),
    },
    ephemeralPrivKey: naclUtil.encodeBase64(ephemeral.secretKey), // не передавати
  };
}

export function fastDecrypt(packet: EncryptedPacket, recipientPrivKeyB64: string): string {
  const recipientPrivKey = naclUtil.decodeBase64(recipientPrivKeyB64);
  const ephemeralPubKey = naclUtil.decodeBase64(packet.ephemeralPubKey);
  const nonce = naclUtil.decodeBase64(packet.nonce);
  const ciphertext = naclUtil.decodeBase64(packet.ciphertext);

  const sharedKey = nacl.box.before(ephemeralPubKey, recipientPrivKey);
  const decrypted = nacl.box.open.after(ciphertext, nonce, sharedKey);

  if (!decrypted) throw new Error('Decryption failed');

  return naclUtil.encodeUTF8(decrypted);
}

// ========= key =========
export function initKeyLite(): void {
 key = generateKeyPair();
}

export function getKeyLite() {
  return key;
}

export async function getPublicKeyServerLite(): Promise<string> {
  const response = await axios.get<any>("http://localhost:3006/public_key_lite");
  return response.data.key;
}

export function getPublicKeyServerLiteSIS(id: string, callback: (key: string) => void) {
  getSocketGlobal()?.emit('get_pub_lite_key_SIS', { id }, (response: string) => {
    callback(response);
  });
}