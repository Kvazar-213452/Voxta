import { getSocketGlobal } from "../chatController";

export function addUserInChat(id: string, userId: string): void {
  getSocketGlobal()?.emit("add_user_in_chat", { id: id, userId: userId });
}

export function delUserInChat(id: string, userId: string): void {
  getSocketGlobal()?.emit("del_user_in_chat", { id: id, userId: userId });
}

export function saveChatSettings(id: string, dataChat: any): void {
    getSocketGlobal()?.emit("save_settings_chat", { id: id, dataChat: dataChat });
}
