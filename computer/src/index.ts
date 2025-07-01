import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { setupIPC } from './ipcHandler';
import { MainApp } from './internal/utils/start';
import { setMainWindow } from './internal/models/mainWindow';
import { configApp } from './config';
import { initDatabase } from './internal/models/sqlite';
import { delay } from './internal/utils/utils';
import { initKeyText } from './internal/models/storageApp';

let mainWindow: BrowserWindow | null;

async function createWindow(): Promise<BrowserWindow> {
  mainWindow = new BrowserWindow({
    width: configApp.width,
    height: configApp.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setMainWindow(mainWindow);

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(path.join(__dirname, '../web/load.html'));

  await delay(configApp.timeStop);

  return mainWindow;
}

app.whenReady().then(async () => {
  await initKeyText();
  initDatabase();
  mainWindow = await createWindow();
  setupIPC();
  MainApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
