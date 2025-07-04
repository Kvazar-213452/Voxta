import { getSocketGlobal } from "../chatController";

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

export function addChatOflineOnDB(chat) {
  
}
