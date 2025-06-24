import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onLoadChatContent(socket: Socket, SECRET_KEY: string) {
  socket.on("load_chat_content", async (data: { chat_id: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      try {
        const collection = db.collection<any>(data.chat_id);

        const messages = await collection
          .find({ _id: { $not: { $eq: "config" } } })
          .sort({ _id: -1 })
          .limit(100)
          .toArray();

        socket.emit("load_chat_content_return", {
          code: 1,
          chat_id: data.chat_id,
          messages: messages.reverse()
        });

      } catch (err) {
        console.error(`error loading chat ${data.chat_id}:`, err);
        socket.emit("load_chat_content_return", {
          code: 0,
          chat_id: data.chat_id,
          error: "chat_not_found"
        });
      }

    } catch (error) {
      console.error("getInfoChats error:", error);
      socket.emit("load_chat_content_return", { code: 0, error: "server_error" });
    }
  });
}
