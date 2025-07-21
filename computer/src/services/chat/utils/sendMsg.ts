import { getSocketGlobal } from '../chatController';
import { addMessage, getAllChatIds } from '../../../models/sqliteStorage/chatUtils/chats';
import { getMainWindow } from '../../../models/mainWindow';
import { autoCrypto } from '../../../utils/crypto/cryproAuto';

let msgOffline: Message;

export async function sendMessage(message: MessageNoneId, chatId: string, type: string): Promise<void> {
  if (type === 'online' || type === 'server') {
    let data = await autoCrypto(message, type, {chatId: chatId});

    getSocketGlobal()?.emit('send_message', { message: data.msg, chatId: chatId, pubKey: data.key, crypto: data.crypto, type: type });
  } else {
    msgOffline = addMessage(chatId, message);

    getMainWindow().webContents.send('reply', {
      type: 'came_chat_msg',
      message: msgOffline,
      chat_id: chatId
    });

    getSocketGlobal()?.emit('get_info_chat', { chatId: chatId, type: 'profile' });
  }
}

export function getMsgOffline(): Message {
  return msgOffline;
}
