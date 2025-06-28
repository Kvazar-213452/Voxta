import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export function onAuthenticate(socket: Socket, SECRET_KEY: string, onlineUsers: Map<string, string>) {
  socket.on("authenticate", async (data: { token: string }) => {
    try {
      const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };

      socket.data.token = data.token;
      onlineUsers.set(decoded.id_user, socket.id);

      (socket as any).userId = decoded.id_user;

      socket.emit("authenticated", {
        code: 1,
        status: "online"
      });

      console.log(`user ${decoded.id_user} authenticated.`);
      
    } catch (error) {
      socket.emit("authenticated", { code: 0 });
      socket.disconnect();
    }
  });
}
