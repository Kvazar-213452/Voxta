import { Socket } from "socket.io";

export function onError(socket: Socket) {
  socket.on("error", (error) => {
    console.error("error:", error);
  });
}
