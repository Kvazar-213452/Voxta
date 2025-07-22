import { getSocketGlobal } from "../chatController";

export function delFriend(id: string): void {
  getSocketGlobal()?.emit("del_friend", { id: id });
}

export function findFriend(name: string): void {
  getSocketGlobal()?.emit("find_friend", { name: name });
}

export function adddFriend(id: string): void {
  getSocketGlobal()?.emit("add_friend", { id: id });
}

export function getFriengs(type: string): void {
  getSocketGlobal()?.emit("get_friends", {type: type});
}
