import { getMessagesByChatId } from "../../../models/sqliteStorage/chatUtils/chats";
import { getMainWindow } from '../../../models/mainWindow';

export function loadChatContentLocal(chat_id: string, participants): void {
  const messages = getMessagesByChatId(chat_id);
  
  getMainWindow().webContents.send('reply', {
    type: "load_chat_content_offline",
    content: JSON.stringify(messages, null, 2),
    id: chat_id,
    participants: participants
  });
}
