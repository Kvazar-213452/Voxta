import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onGetInfoChat(socket: Socket, SECRET_KEY: string): void {
  socket.on("get_info_chat", async (data: { chatId: string, type: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const chatId = data.chatId;

      try {
        const collection = db.collection<{ _id: string; [key: string]: any }>(chatId);
        const chatConfig = await collection.findOne({ _id: "config" });
        
        if (chatConfig) {
          const { _id, ...chatWithoutId } = chatConfig;
          socket.emit("chat_info", { code: 1, chat: chatWithoutId, type: data.type });
        } else {
          socket.emit("chat_info", { code: 0, error: "config_not_found", type: data.type });
        }
      } catch (err) {
        console.error(`DB error for chat ${chatId}:`, err);
        socket.emit("chat_info", { code: 0, error: "db_error", type: data.type });
      }

    } catch (error) {
      socket.emit("chat_info", { code: 0, error: "server_error", type: data.type });
    }
  });
}
