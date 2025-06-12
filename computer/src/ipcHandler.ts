import { ipcMain, IpcMainEvent } from 'electron';
import { login } from './internal/services/authentication';

export function setupIPC(): void {
  ipcMain.on('message', (event: IpcMainEvent, msg: any) => {
    if (msg.type === 'login') {
      login(event, msg);
    }
  });
}
