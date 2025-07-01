import { ipcMain, IpcMainEvent } from 'electron';
import { login } from './internal/services/authentication';
import { register } from './internal/services/registration';
import { returnSettings, saveSettingsFix } from './internal/services/settings';
import { loadChatContent, sendMessage, reconnectSocketClient } from './internal/services/chat/chatController';
import { getStatus } from './internal/services/status/statusController';
import { createChat } from './internal/services/chat/events_msg/createChat';
import { getInfoUsers, getInfoUser } from './internal/services/chat/events_msg/getInfoUsers';
import { loadIndexTemplate } from './internal/utils/utils';

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
    } else if (msg.type === 'get_status_user') {
      getStatus(msg.user_id);
    } else if (msg.type === 'load_template') {
      loadIndexTemplate();
    } else if (msg.type === 'create_chat') {
      createChat(msg.chat);
    } else if (msg.type === 'get_info_users') {
      getInfoUsers(msg.users);
    } else if (msg.type === 'get_info_user') {
      getInfoUser(msg.id);
    } else if (msg.type === 'register') {
      register(msg);
    }
  });
}
