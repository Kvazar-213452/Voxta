const keytar = require('keytar');
const { config } = require('../../config');

// ==== CONFIG ====
const SERVICE_NAME = config.SERVICE_NAME;

// ==== TOKENS ====
const ACCOUNT_TOKEN = 'sessionToken';
async function saveToken(token) {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_TOKEN, token);
}

async function getToken() {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_TOKEN);
}

async function deleteToken() {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_TOKEN);
}

// ==== KEYS ====
const ACCOUNT_PUBLIC_KEY = 'publicKey';
const ACCOUNT_PRIVATE_KEY = 'privateKey';

async function saveKeys(publicKey, privateKey) {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY, publicKey);
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_PRIVATE_KEY, privateKey);
}

async function getPublicKey() {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
}

async function getPrivateKey() {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_PRIVATE_KEY);
}

async function deleteKeys() {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_PUBLIC_KEY);
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_PRIVATE_KEY);
}

module.exports = {
  // Tokens
  saveToken,
  getToken,
  deleteToken,

  // Keys
  saveKeys,
  getPublicKey,
  getPrivateKey,
  deleteKeys
};
