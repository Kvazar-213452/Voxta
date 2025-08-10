import { getSocketGlobal } from "../chatController";
import { getMessagesByChatId } from '../../../models/sqliteStorage/chatUtils/chats';
import { getMainWindow } from '../../../models/mainWindow';
import { createChat as createChatInDB } from '../../../models/sqliteStorage/chatUtils/chats';

export function saveChatSettings(id: string, dataChat: any, typeChat: string): void {
  getSocketGlobal()?.emit("save_settings_chat", { id: id, dataChat: dataChat, typeChat: typeChat });
}

// ======= create chat =======
export function createChat(chat: Chat): void {
  getSocketGlobal()?.emit('create_chat', { chat: chat });
}

export function addChatOflineOnDB(id: string): void {
  createChatInDB(id);
}

export function createChatServer(chat: any): void {
  getSocketGlobal()?.emit('create_chat_server', { chat: chat });
}

// ======= local chat =======
export function loadChatContentLocal(chatId: string, participants): void {
  const messages = getMessagesByChatId(chatId);
  
  getMainWindow().webContents.send('reply', {
    type: 'load_chat_content_offline',
    content: JSON.stringify(messages, null, 2),
    id: chatId,
    participants: participants
  });
}
