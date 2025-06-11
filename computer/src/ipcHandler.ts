import { ipcMain, IpcMainEvent } from 'electron';
import axios from 'axios';
import { login } from './internal/modules/authentication';

export function setupIPC(): void {
  ipcMain.on('message', (event: IpcMainEvent, msg: any) => {
    if (msg.type === 'login') {
      login(event, msg);
    }
  });
}
