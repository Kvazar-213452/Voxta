import { getMessagesByChatId } from "../../../models/sqliteStorage/chatUtils/chats";
import { getMainWindow } from '../../../models/mainWindow';

export function loadChatContentLocal(chatId: string, participants): void {
  const messages = getMessagesByChatId(chatId);
  
  getMainWindow().webContents.send('reply', {
    type: "load_chat_content_offline",
    content: JSON.stringify(messages, null, 2),
    id: chatId,
    participants: participants
  });
}
