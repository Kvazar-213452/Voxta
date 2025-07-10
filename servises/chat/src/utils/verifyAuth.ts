import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export function verifyAuth(socket: Socket, secret: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(socket.data.token, secret) as { userId: string };
    return decoded;
  } catch (err) {
    console.log(`no valid jwt from ${socket.id}`);
    socket.disconnect();
    return null;
  }
}
