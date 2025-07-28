import { io, Socket } from "socket.io-client";
import { getToken } from '../../models/storageApp';
import { configServises } from '../../config';
import { debugLog } from '../../utils/utils';

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
  debugLog("start trafficJams server");

  const socket = io(configServises.TRAFFIC_JAMS);
  socketGlobal = socket;

  const token = await getToken();

  socket.on("connect", () => {
    console.log("conect good:", socket.id);
    socket.emit("authenticate", { token });
  });

  socket.on("authenticated", async (data) => {
    console.log(`authenticated good: ${data.status}`);
  });

  socket.on("message", async (data) => {
    console.log("msg:", data);
  });

  socket.on("error", async (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}

function sendMsgOffline(msg, participants) {
  let msgToSend = typeof msg === "string" ? msg : JSON.stringify(msg);

  console.log("send message", msgToSend, participants);
  socketGlobal?.emit("send", { msg: msgToSend, participants });
}

export {
  startClientTrafficJams,
  reconnectSocketClient,
  sendMsgOffline
};
