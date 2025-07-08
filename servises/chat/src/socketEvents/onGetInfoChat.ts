import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onGetInfoChat(socket: Socket, SECRET_KEY: string) {
  socket.on("getInfoChat", async (data: { chatId: string }) => {
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
          socket.emit("chatsInfo", { code: 1, chat: chatConfig });
        } else {
          socket.emit("chatsInfo", { code: 0, error: "config_not_found" });
        }
      } catch (err) {
        console.error(`DB error for chat ${chatId}:`, err);
        socket.emit("chatsInfo", { code: 0, error: "db_error" });
      }

    } catch (error) {
      console.error("getInfoChat server error:", error);
      socket.emit("chatsInfo", { code: 0, error: "server_error" });
    }
  });
}
