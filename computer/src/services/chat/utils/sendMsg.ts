import { getSocketGlobal } from '../chatController';
import { addMessage, getAllChatIds } from '../../../models/sqliteStorage/chatUtils/chats';
import { getMainWindow } from '../../../models/mainWindow';
import { getKeyLite, fastEncrypt, getPublicKeyServerLite, initKeyLite }from '../../../utils/crypto/SPX_CriptoLite';

let msgOffline: Message;
let countCripto: number = 0;

export async function sendMessage(message: MessageNoneId, chatId: string, type: string): Promise<void> {
  if (type === 'online') {
    if (countCripto > 5) {
      initKeyLite();
    }

    const { packet } = fastEncrypt(JSON.stringify(message), await getPublicKeyServerLite());

    getSocketGlobal()?.emit('send_message', { message: packet, chatId: chatId, pubKey: getKeyLite().publicKey });
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
