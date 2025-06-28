import { Socket } from "socket.io";

export function onDisconnect(socket: Socket, onlineUsers: Map<string, string>) {
  socket.on("disconnect", () => {
    const userId = (socket as any).userId;
    if (userId) {
      console.log(`User ${userId} disconnected.`);
      onlineUsers.delete(userId);
    }
  });
}
