import { ipcMain, IpcMainEvent } from 'electron';
import { handleAuth } from './ipcHandlers/authHandlers';
import { handleChat } from './ipcHandlers/chatHandlers';
import { handleInternal } from './ipcHandlers/internalHandlers';
import { handleGetInfo } from './ipcHandlers/getInfoHandlers';

export function setupIPC(): void {
  ipcMain.on('message', async (event: IpcMainEvent, msg: any) => {
    if (handleAuth(event, msg)) return;
    if (await handleChat(msg)) return;
    if (handleInternal(msg)) return;
    if (handleGetInfo(msg)) return;
  });
}
