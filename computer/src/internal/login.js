const axios = require('axios');

async function login(event, msg) {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      name: msg["name"],
      password: msg["pasw"],
      key: "ddd"
    });

    event.reply('reply', response.data);
  } catch (error) {
    console.log('errro to server:', error);
    event.reply('reply', { error: error.response?.data || 'Помилка сервера' });
  }
}

module.exports = { login };
