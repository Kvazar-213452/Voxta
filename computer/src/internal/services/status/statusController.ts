import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { getMainWindow } from '../../models/mainWindow';

let socketGlobal: Socket | null = null;

function getStatus(id: string): string {
  if (socketGlobal) {
    socketGlobal.emit("get_status", { id_user: id });
    return "error";
  } else {
    return "error";
  }
}

async function reconnectSocketClient(): Promise<void> {
  if (socketGlobal) {
    socketGlobal.removeAllListeners();
    socketGlobal.disconnect();
    socketGlobal = null;
  }
  await startClientStatus();
}

async function startClientStatus(): Promise<void> {
  console.log("start status");

  const socket = io("http://localhost:3002");
  socketGlobal = socket;

  const token = await getToken();

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", async (data) => {
    console.log(`authenticated good: ${data.status}`);
  });

  socket.on("get_status_return", async (data) => {
    if (data.code) {
      getMainWindow().webContents.send('reply', { type: "get_status_user", status: data.status });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

export {
  startClientStatus,
  reconnectSocketClient,
  getStatus
};
