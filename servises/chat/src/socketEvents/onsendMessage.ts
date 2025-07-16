import { Socket } from "socket.io";
import { Db } from "mongodb";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { generateId } from "../utils/generateId";
import { safeParseJSON } from "../utils/utils";
import { fastDecrypt, getKeyLite } from "../utils/cripto/SPX_CriptoLite";

export function onSendMessage(socket: Socket, SECRET_KEY: string): void {
  socket.on("send_message", async (data: { message: any, chatId: string, pubKey: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      let message: any = fastDecrypt(data.message, getKeyLite().privateKey);
      message = safeParseJSON(message);

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const collection = db.collection<any>(data.chatId);

      const messageToInsert = {
        _id: generateId(12),
        sender: message.sender,
        content: message.content,
        time: message.time
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
