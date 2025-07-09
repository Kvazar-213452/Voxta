import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { generateId } from "../utils/generateId";
import { Db } from "mongodb";

export function onSendMessage(socket: Socket, SECRET_KEY: string): void {
  socket.on("send_message", async (data: { message: MessageNoneId, chatId: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const collection = db.collection<any>(data.chatId);

      const messageToInsert = {
        _id: generateId(12),
        sender: data.message.sender,
        content: data.message.content,
        time: data.message.time
      };

      await collection.insertOne(messageToInsert);

      socket.emit("send_message_return", {
        code: 1,
        chatId: data.chatId,
        message: messageToInsert
      });

    } catch (error) {
      console.error("send_message error:", error);
      socket.emit("send_message_return", { code: 0, error: "server_error" });
    }
  });
}
