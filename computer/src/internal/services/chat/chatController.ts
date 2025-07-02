import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { saveUser } from '../../models/sqliteStorage/user';
import { getMainWindow } from '../../models/mainWindow';
import { loadChatContentLocal } from './eventsMsg/loadChatContentLocal';
import { configServises } from '../../../config';

let socketGlobal: Socket | null = null;
let user: any;

function loadChatContent(chat_id: string, type_chat: string): void {
  if (type_chat === "online" && socketGlobal?.connected) {
    socketGlobal.emit("load_chat_content", { chat_id });
  } else {
    loadChatContentLocal(chat_id);
  }
}

function getSocketGlobal(): Socket | null {
  return socketGlobal;
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
  await startClientChat();
}

async function startClientChat(): Promise<void> {
  console.log("start");

  const socket = io(configServises.CHAT);
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

  socket.on("send_message_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "came_chat_msg",
      message: data.message,
      chat_id: data.chat_id
    });
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

  socket.on("get_info_users_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "info_users",
      users: data.users,
    });
  });

  socket.on("get_info_user_return", (data) => {
    getMainWindow().webContents.send('reply', {
      type: "info_user",
      user: data.user,
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

export {
  startClientChat,
  reconnectSocketClient,
  loadChatContent,
  sendMessage,
  getSocketGlobal
};
