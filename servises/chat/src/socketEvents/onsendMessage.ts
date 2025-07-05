import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

function generateRandomId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function onsendMessage(socket: Socket, SECRET_KEY: string): void {
  socket.on("send_message", async (data: { message: Message, chatId: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const collection = db.collection<any>(data.chatId);

      const messageToInsert = {
        _id: generateRandomId(12),
        sender: data.message.sender,
        content: data.message.content,
        time: data.message.time
      };

      await collection.insertOne(messageToInsert);

      socket.emit("send_message_return", {
        code: 1,
        chat_id: data.chatId,
        message: messageToInsert
      });

    } catch (error) {
      console.error("send_message error:", error);
      socket.emit("send_message_return", { code: 0, error: "server_error" });
    }
  });
}
