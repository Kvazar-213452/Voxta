import { getSocketGlobal } from '../chatController';
import { addMessage, getAllChatIds } from '../../../models/sqliteStorage/chatUtils/chats';
import { getMainWindow } from '../../../models/mainWindow';

let msgOffline: Message;

export function sendMessage(message: any, chatId: string, type: string): void {
  if (type === 'online') {
    getSocketGlobal()?.emit('send_message', { message, chatId });
  } else {
    message = addMessage(chatId, message);
    msgOffline = message;

    getMainWindow().webContents.send('reply', {
      type: 'came_chat_msg',
      message: message,
      chat_id: chatId
    });

    getSocketGlobal()?.emit('get_info_chat', { chatId: chatId, type: 'profile' });
  }
}

export function getMsgOffline(): Message {
  return msgOffline;
}
