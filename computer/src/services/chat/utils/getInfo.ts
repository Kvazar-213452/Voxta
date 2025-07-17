import { getSocketGlobal } from "../chatController";

export function getInfoUsers(users: any, type: string): void {
  getSocketGlobal()?.emit("get_info_users", { users: users, type: type });
}

export function getInfoUser(id: string, type: string): void {
  getSocketGlobal()?.emit("get_info_user", { userId: id.toString(), type: type });
}

export function getInfoChat(id: string, type: string): void {
  getSocketGlobal()?.emit("get_info_chat", { chatId: id.toString(), type: type });
}

export function getFriengs(type: string): void {
  getSocketGlobal()?.emit("get_friends", {type: type});
}
