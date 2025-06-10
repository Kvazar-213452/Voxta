const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { setupIPC } = require('./ipcHandler');
const { check_app } = require('./internal/start');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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

  return mainWindow;
}

app.whenReady().then(() => {
  mainWindow = createWindow();
  setupIPC();

  mainWindow.webContents.on('did-finish-load', () => {
    check_app(mainWindow);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
