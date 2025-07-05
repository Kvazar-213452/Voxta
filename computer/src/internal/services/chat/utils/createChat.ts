import { getSocketGlobal } from "../chatController";
import { createChat as createChatInDB } from "../../../models/sqliteStorage/chatUtils/chats";

interface Chat {
  name: string;
  description: string;
  privacy: string;
  avatar: string | null;
  createdAt: string;
}

export function createChat(chat: Chat): void {
  getSocketGlobal()?.emit("create_chat", { chat: chat });
}

export function addChatOflineOnDB(id) {
  createChatInDB(id);
}
