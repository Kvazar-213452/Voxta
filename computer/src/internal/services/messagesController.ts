import { io, Socket } from "socket.io-client";
import { getToken } from '../models/storageApp';
import { saveUser } from '../models/sqliteStorage/user';
import { getMainWindow } from '../models/mainWindow';
import { loadChatContentLocal } from './events_msg/loadChatContentLocal';

let socketGlobal: Socket | null = null;
let user;

function loadChatContent(chat_id: string, type_chat: string): void {
  if (type_chat === "online" && socketGlobal?.connected) {
    socketGlobal.emit("load_chat_content", { chat_id });
  } else {
    loadChatContentLocal(chat_id);
  }
}

function sendMessage(message: any, chat_id: string, chat_type: string): void {
  socketGlobal?.emit("send_message", { message, chat_id });
}

async function reconnectSocketClient(): Promise<void> {
  if (socketGlobal) {
    socketGlobal.removeAllListeners();
    socketGlobal.disconnect();
    socketGlobal = null;
  }
  await startSocketClient();
}

async function startSocketClient(): Promise<void> {
  console.log("start");

  const socket = io("http://localhost:3001");
  socketGlobal = socket;

  const token = await getToken();

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", async (data) => {
    console.log("auf good:");
    user = data.user;

    getMainWindow().webContents.send('reply', { type: "get_user", user: data.user });
    await saveUser(data.user);

    socket.emit("getInfoChats", { chats: user.chats });
  });

  socket.on("chatsInfo", (data) => {
    if (data.code === 1) {
      getMainWindow().webContents.send('reply', { type: "load_chats", chats: data.chats });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("send_message_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "came_chat_msg",
      message: data.message,
      chat_id: data.chat_id
    });
  });

  socket.on("load_chat_content_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "load_chat_content",
      content: data.messages,
      chat_id: data.chat_id
    });
  });
}

export {
  startSocketClient,
  reconnectSocketClient,
  loadChatContent,
  sendMessage
};
