import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setupIPC } from './ipcHandler';
import { check_app } from './internal/utils/start';
import { setMainWindow } from './internal/models/mainWindow';
import { config } from './config';

let mainWindow: BrowserWindow | null;

function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: config.width,
    height: config.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setMainWindow(mainWindow);

  mainWindow.loadFile(path.join(__dirname, '../web/index.html'));
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
