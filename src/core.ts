import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { setupIPC } from './mainIPC';
import { MainApp } from './utils/main';
import { setMainWindow } from './models/mainWindow';
import { configApp } from './config';
import { initDatabase } from './models/sqliteStorage/servise';
import { initDatabaseChats } from './models/sqliteStorage/chats';
import { delay } from './utils/utils';
import { initKeyLite } from './utils/crypto/SPX_CriptoLite';
import { initKeyText } from './models/storageApp';

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

  if (configApp.Debug) {
    mainWindow.loadFile(path.join(__dirname, '../web/load.html'));

    await delay(configApp.timeStop);
  }

  return mainWindow;
}

app.whenReady().then(async () => {
  initKeyLite();
  await initKeyText();
  initDatabase();
  initDatabaseChats();
  mainWindow = await createWindow();
  setupIPC();
  MainApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
