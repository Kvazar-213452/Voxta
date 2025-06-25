import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { setupIPC } from './ipcHandler';
import { check_app } from './internal/utils/start';
import { setMainWindow } from './internal/models/mainWindow';
import { config } from './config';
import { initDatabase } from './internal/models/sqlite';

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
  initDatabase();
  mainWindow = createWindow();
  setupIPC();
  check_app();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
