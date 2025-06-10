const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'web/index.html'));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.on('message', async (event, msg) => {
  if (msg["type"] === "login") {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        name: msg["name"],
        password: msg["pasw"]
      });

      event.reply('reply', response.data);
    } catch (error) {
      console.error('Помилка при запиті на бекенд:', error);
      event.reply('reply', { error: error.response?.data || 'Помилка сервера' });
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
