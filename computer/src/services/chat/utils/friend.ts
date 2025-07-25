import { getSocketGlobal } from "../chatController";

export function delFriend(id: string): void {
  getSocketGlobal()?.emit("del_friend", { id: id });
}

export function adddFriend(code: string): void {
  getSocketGlobal()?.emit("add_friend", { code: code });
}

export function getFriengs(type: string): void {
  getSocketGlobal()?.emit("get_friends", {type: type});
}
