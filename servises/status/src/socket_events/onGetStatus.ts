import { Socket } from "socket.io";
import { verifyAuth } from "../utils/verifyAuth";

export function onGetStatus(socket: Socket, SECRET_KEY: string, onlineUsers: Map<string, string>) {
  socket.on("getStatus", async (data: { id_user: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const isOnline = onlineUsers.has(data.id_user);
      const result = isOnline ? "online" : "offline";

      socket.emit("getStatus", { code: 1, status: result });

    } catch (error) {
      console.error("getStatus error:", error);
      socket.emit("getStatus", { code: 0, error: "server_error" });
    }
  });
}
