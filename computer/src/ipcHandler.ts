import { ipcMain, IpcMainEvent } from 'electron';
import { login } from './internal/services/authentication';
import { returnSettings, saveSettingsFix } from './internal/services/settings';
import { loadChatContent, sendMessage, reconnectSocketClient } from './internal/services/messagesController';

export function setupIPC(): void {
  ipcMain.on('message', async (event: IpcMainEvent, msg: any) => {
    if (msg.type === 'login') {
      login(event, msg);
    } else if (msg.type === 'load_chat') {
      loadChatContent(msg.id, msg.type_chat);
    } else if (msg.type === 'send_msg') {
      sendMessage(msg.message, msg.chat_id, msg.chat_type);
    } else if (msg.type === 'reconnect_socket_client') {
      await reconnectSocketClient();
    } else if (msg.type === 'get_settings') {
      returnSettings();
    } else if (msg.type === 'save_settings') {
      saveSettingsFix(msg.settings);
    } 
  });
}