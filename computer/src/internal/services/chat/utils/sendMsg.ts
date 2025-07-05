import { getSocketGlobal } from "../chatController";
import { addMessage } from "../../../models/sqliteStorage/chatUtils/chats";
import { getMainWindow } from '../../../models/mainWindow';
import { sendMsgOffline } from '../../../services/trafficJams/trafficJams';

export function sendMessage(message: any, chat_id: string, type: string): void {
  if (type === "online") {
    getSocketGlobal()?.emit("send_message", { message, chat_id });
  } else {
    let messageReturn: Message = addMessage(chat_id, message);

    sendMsgOffline(messageReturn);

    getMainWindow().webContents.send('reply', {
      type: "came_chat_msg",
      message: messageReturn,
      chat_id: chat_id
    });
  }
}
