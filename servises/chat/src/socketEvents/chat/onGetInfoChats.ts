import { Socket } from "socket.io";
import { getMongoClient } from "../../models/mongoClient";
import { verifyAuth } from "../../utils/verifyAuth";
import { getChatsServer } from "../../utils/serverChats";
import { Db } from "mongodb";

export function onGetInfoChats(socket: Socket): void {
  socket.on("getInfoChats", async (data: { chats: string[] }) => {
    try {
      const auth = verifyAuth(socket);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const result: Record<string, any> = {};

      const cachedChats = getChatsServer(data.chats);

      for (const [chatId, chatData] of Object.entries(cachedChats)) {
        result[chatId] = chatData;
      }

      const remainingChats = data.chats.filter(chatId => !result.hasOwnProperty(chatId));
      
      for (const chatId of remainingChats) {
        try {
          const collection = db.collection<{ _id: string; [key: string]: any }>(chatId);
          const chatConfig = await collection.findOne({ _id: "config" });

          if (chatConfig) {
            result[chatId] = chatConfig;
          }
        } catch (err) {
          console.error(`DB chat error ${chatId}:`, err);
        }
      }

      socket.emit("chats_info", { code: 1, chats: result });

    } catch (error) {
      console.error("getInfoChats error:", error);
      socket.emit("chats_info", { code: 0, error: "server_error" });
    }
  });
}

