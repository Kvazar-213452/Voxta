import { io } from "socket.io-client";
import { getToken, saveUser } from '../models/storage_app';
import { getMainWindow } from '../models/mainWindow';

async function startSocketClient(): Promise<void> {
  console.log("start")

  const socket = io("http://localhost:3001");
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
    socket.emit("getInfoChats", {chats: user.chats});
  });

  socket.on("chatsInfo", (data) => {
    if (data.code === 1) {
      getMainWindow().webContents.send('reply', {type: "load_chats", chats: data.chats});
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

export { startSocketClient };
