import { getSocketGlobal } from "../chatController";
import { addMessage, getAllChatIds } from "../../../models/sqliteStorage/chatUtils/chats";
import { getMainWindow } from '../../../models/mainWindow';
import { sendMsgOffline } from '../../trafficJams/trafficJams';

export function sendMessage(message: any, chat_id: string, type: string): void {
  if (type === "online") {
    getSocketGlobal()?.emit("send_message", { message, chat_id });
  } else {
    message = addMessage(chat_id, message);

    sendMsgOffline(message);

    getMainWindow().webContents.send('reply', {
      type: "came_chat_msg",
      message: message,
      chat_id: chat_id
    });
  }
}
