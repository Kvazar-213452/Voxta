import { Socket } from "socket.io-client";
import { getMainWindow } from '../../../models/mainWindow';

export function registerMessageEvents(socket: Socket) {
  socket.on("send_message_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "came_chat_msg",
      message: data.message,
      chat_id: data.chat_id
    });
  });
}
