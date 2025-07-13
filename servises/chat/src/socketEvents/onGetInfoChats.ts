import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onGetInfoChats(socket: Socket, SECRET_KEY: string): void {
  socket.on("getInfoChats", async (data: { chats: string[] }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const result: Record<string, any> = {};

        for (const chatId of data.chats) {
            try {
                const collection = db.collection<{ _id: string; [key: string]: any }>(chatId);
                const chatConfig = await collection.findOne({ _id: "config" });

                if (chatConfig) {
                    result[chatId] = chatConfig;
                }
            } catch (err) {
                console.error(`error chats ${chatId}:`, err);
            }
        }

      socket.emit("chats_info", { code: 1, chats: result });

    } catch (error) {
      console.error("getInfoChats error:", error);
      socket.emit("chats_info", { code: 0, error: "server_error" });
    }
  });
}
