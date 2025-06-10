const { ipcMain } = require('electron');
const axios = require('axios');
const { login } = require('./internal/login');

function setupIPC() {
  ipcMain.on('message', (event, msg) => {
    if (msg["type"] === "login") {
      login(event, msg);
    }
  });
}

module.exports = { setupIPC };
