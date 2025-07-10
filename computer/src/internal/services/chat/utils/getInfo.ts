import { getSocketGlobal } from "../chatController";

export function getInfoUsers(users: any): void {
  getSocketGlobal()?.emit("get_info_users", { users: users });
}

export function getInfoUser(id: string, type: string): void {
  getSocketGlobal()?.emit("get_info_user", { userId: id.toString(), type: type });
}

export function getInfoChat(id: string, type: string): void {
  getSocketGlobal()?.emit("get_info_chat", { chatId: id.toString(), type: type });
}
