const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { setupIPC } = require('./ipcHandler');
const { check_app } = require('./internal/start');
const { setMainWindow } = require('./internal/castile/mainWindow');

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

  setMainWindow(mainWindow);

  mainWindow.loadFile(path.join(__dirname, 'web/index.html'));
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

app.whenReady().then(() => {
  mainWindow = createWindow();
  setupIPC();
  check_app();
  mainWindow.webContents.on('did-finish-load', () => {
    // null
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
