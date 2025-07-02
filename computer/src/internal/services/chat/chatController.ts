import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { saveUser } from '../../models/sqliteStorage/user';
import { getMainWindow } from '../../models/mainWindow';
import { loadChatContentLocal } from './utils/loadChatContentLocal';
import { configServises } from '../../../config';
import * as chatEvents from './socketEvents/chatEvents';
import * as userEvents from './socketEvents/userEvents';
import * as messageEvents from './socketEvents/messageEvents';

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

  chatEvents.registerChatEvents(socket);
  userEvents.registerUserEvents(socket);
  messageEvents.registerMessageEvents(socket);

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
