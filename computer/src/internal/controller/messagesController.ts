import { io } from "socket.io-client";
import { getToken } from '../models/storage_app';

async function startSocketClient(): Promise<void> {
  console.log("ddddd")

  const socket = io("http://localhost:3001");
  const token = await getToken();

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", (data) => {
    console.log("auf good:", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

export { startSocketClient };
