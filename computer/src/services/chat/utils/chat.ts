import { getSocketGlobal } from "../chatController";

export function addUserInChat(id: string, userId: string): void {
  getSocketGlobal()?.emit("add_user_in_chat", { id: id, userId: userId });
}
