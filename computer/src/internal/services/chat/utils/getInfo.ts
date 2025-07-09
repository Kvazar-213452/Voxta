import { getSocketGlobal } from "../chatController";

export function getInfoUsers(users: any): void {
  getSocketGlobal()?.emit("get_info_users", { users: users });
}

export function getInfoUser(id: string, type: string = "get_info_user_return"): void {
  getSocketGlobal()?.emit("get_info_user", { chatId: id.toString(), type: type });
}
