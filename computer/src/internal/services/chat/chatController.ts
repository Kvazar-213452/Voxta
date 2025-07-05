import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { saveUser } from '../../models/sqliteStorage/serviseUtils/user';
import { getMainWindow } from '../../models/mainWindow';
import { configServises } from '../../../config';
import * as chatEvents from './socketEvents/chatEvents';
import * as userEvents from './socketEvents/userEvents';
import * as messageEvents from './socketEvents/messageEvents';

let socketGlobal: Socket | null = null;
let user: any;

function loadChatContent(chat_id: string, type: string): void {
  socketGlobal?.emit("load_chat_content", { chat_id: chat_id, type: type });
}

function getSocketGlobal(): Socket | null {
  return socketGlobal;
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
  getSocketGlobal
};
