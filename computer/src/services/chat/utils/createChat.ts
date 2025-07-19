import { getSocketGlobal } from '../chatController';
import { createChat as createChatInDB } from '../../../models/sqliteStorage/chatUtils/chats';

export function createChat(chat: Chat): void {
  getSocketGlobal()?.emit('create_chat', { chat: chat });
}

export function addChatOflineOnDB(id: string): void {
  createChatInDB(id);
}

export function createChatServer(chat: any): void {
  getSocketGlobal()?.emit('create_chat_server', { chat: chat });
}
