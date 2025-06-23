import { io } from "socket.io-client";
import { getToken, saveUser } from '../models/storage_app';
import { getMainWindow } from '../models/mainWindow';

let socketGlobal: any = null;

function loadChatContent(chat_id: string, type_chat: string): void {
  if (type_chat === "online") {
    socketGlobal.emit("load_chat_content", { id: chat_id });
  } else {
    loadChatContentLocal(chat_id)
  }
}

function loadChatContentLocal(chat_id: string): void {

}

async function startSocketClient(): Promise<void> {
  console.log("start");

  const socket = io("http://localhost:3001");
  socketGlobal = socket;

  const token = await getToken();
  let user;

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", async (data) => {
    console.log("auf good:");
    user = data.user;

    await saveUser(JSON.stringify(data.user));
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
}

export { startSocketClient, loadChatContent };