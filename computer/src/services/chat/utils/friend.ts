import { getSocketGlobal } from "../chatController";

export function delFriend(id: string): void {
  getSocketGlobal()?.emit("del_friend", { id: id });
}
