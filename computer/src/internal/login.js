const axios = require('axios');
const { config } = require('../config');
const { encryption_msg, getPublicKey_server } = require('./component/crypto_func');
const { getPublicKey } = require('./component/storage_app');

async function login(event, msg) {
  try {
    const PublicKey_server = await getPublicKey_server();

    // Правильно сформуємо JSON перед шифруванням
    const dataToEncrypt = JSON.stringify({
      name: msg["name"],
      password: msg["pasw"]
    });
    const encryption_json = encryption_msg(PublicKey_server, dataToEncrypt);

    // Надсилаємо ЗАШИФРОВАНИЙ рядок на сервер (не парсимо!)
    const response = await axios.post(config.login_url, {
      data: encryption_json,
      key: await getPublicKey()
    });

    event.reply('reply', response.data);
  } catch (error) {
    event.reply('reply', { error: error.response?.data || 'errro server' });
  }
}

module.exports = { login };
