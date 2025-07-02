import { getSocketGlobal } from "../chatController";

interface Chat {
  name: string;
  description: string;
  privacy: string;
  avatar: string | null;
  createdAt: string;
}

export function createChat(chat: Chat): void {
  if (chat["privacy"] === "online") {
    createChatOnline(chat)
  } else {

  }
}

function createChatOnline(chat: Chat) {
    getSocketGlobal()?.emit("create_chat", { chat: chat });
}
