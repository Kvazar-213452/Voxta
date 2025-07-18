import { Socket } from "socket.io";

export function onDisconnect(socket: Socket): void {
  socket.on("disconnect", () => {
    console.log(
      "user disconnect",
      socket.id,
      socket.data.userId ? `(ID: ${socket.data.userId})` : ""
    );
  });
}
