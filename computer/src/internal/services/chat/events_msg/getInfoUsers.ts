import { getSocketGlobal } from "../chatController";

export function getInfoUsers(users: any): void {
  getSocketGlobal()?.emit("get_info_users", { users: users });
}

export function getInfoUser(id: string): void {
  getSocketGlobal()?.emit("get_info_user", { id_user: id });
}
