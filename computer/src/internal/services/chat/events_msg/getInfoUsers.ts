import { getSocketGlobal } from "../chatController";

export function getInfoUsers(users: any) {
  getSocketGlobal()?.emit("get_info_users", { users: users });
}

