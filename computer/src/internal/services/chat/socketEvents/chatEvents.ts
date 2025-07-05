import { Socket } from "socket.io-client";
import { getMainWindow } from '../../../models/mainWindow';
import { addChatOflineOnDB } from '../utils/createChat';
import { loadChatContentLocal } from '../utils/loadChatContentLocal';
import { safeParseJSON } from '../../../utils/utils';

export function registerChatEvents(socket: Socket): void {
  socket.on("chatsInfo", (data) => {
    if (data.code === 1) {
      getMainWindow().webContents.send('reply', { type: "load_chats", chats: data.chats });
    }
  });

  socket.on("create_new_chat", (data) => {
    let dataChat = data.chat;
    dataChat = safeParseJSON(dataChat);

    if (dataChat.type === "offline") {
      addChatOflineOnDB(data.chatId);
    }

    getMainWindow().webContents.send('reply', {
      type: "create_new_chat_render",
      chat: data.chat
    });
  });

  socket.on("load_chat_content_return", (data) => {
    if (data.type === "offline") {
      loadChatContentLocal(data.chat_id, data.participants);
    } else {
      getMainWindow().webContents.send('reply', {
        type: "load_chat_content",
        content: data.messages,
        chat_id: data.chat_id,
        participants: data.participants
      });
    }
  });
}
