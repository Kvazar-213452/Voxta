import { Socket } from "socket.io-client";
import { getMainWindow } from '../../../models/mainWindow';

export function registerChatEvents(socket: Socket) {
  socket.on("chatsInfo", (data) => {
    if (data.code === 1) {
      getMainWindow().webContents.send('reply', { type: "load_chats", chats: data.chats });
    }
  });

  socket.on("create_new_chat", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "create_new_chat_render",
      chat: data.chat
    });
  });

  socket.on("load_chat_content_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "load_chat_content",
      content: data.messages,
      chat_id: data.chat_id,
      participants: data.participants
    });
  });
}
