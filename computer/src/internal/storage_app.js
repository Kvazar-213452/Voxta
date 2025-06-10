const keytar = require('keytar');
const { config } = require('../config');

async function saveToken(token) {
  await keytar.setPassword(config.SERVICE_NAME, config.ACCOUNT_NAME, token);
}

async function getToken() {
  return await keytar.getPassword(config.SERVICE_NAME, config.ACCOUNT_NAME);
}

async function deleteToken() {
  await keytar.deletePassword(config.SERVICE_NAME, config.ACCOUNT_NAME);
}

module.exports = {
  saveToken,
  getToken,
  deleteToken
};
