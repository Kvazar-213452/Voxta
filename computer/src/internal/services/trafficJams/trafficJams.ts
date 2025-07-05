import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { configServises } from '../../../config/config';

let socketGlobal: Socket | null = null;

async function reconnectSocketClient(): Promise<void> {
  if (socketGlobal) {
    socketGlobal.removeAllListeners();
    socketGlobal.disconnect();
    socketGlobal = null;
  }
  await startClientTrafficJams();
}

async function startClientTrafficJams(): Promise<void> {
  console.log("start trafficJams");

  const socket = io(configServises.STATUS);
  socketGlobal = socket;

  const token = await getToken();

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", async (data) => {
    console.log(`authenticated good: ${data.status}`);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

function sendMsgOffline(msg: Message): void {
  socketGlobal?.emit("send", { data: msg });
}

export {
  startClientTrafficJams,
  reconnectSocketClient,
  sendMsgOffline
};
