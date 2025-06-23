import { ipcMain, IpcMainEvent } from 'electron';
import { login } from './internal/services/authentication';
import { loadChatContent } from './internal/controller/messagesController';

export function setupIPC(): void {
  ipcMain.on('message', (event: IpcMainEvent, msg: any) => {
    if (msg.type === 'login') {
      login(event, msg);
    } else if (msg.type === 'load_chat') {
      loadChatContent(msg.id, msg.type_chat)
    }
  });
}
