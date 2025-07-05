import { getSocketGlobal } from "../chatController";

export function loadChatContent(chat_id: string, type: string): void {
  getSocketGlobal()?.emit("load_chat_content", { chat_id: chat_id, type: type });
}
