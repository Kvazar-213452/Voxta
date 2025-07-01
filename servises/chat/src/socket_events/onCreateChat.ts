import { Socket } from "socket.io";
import axios from "axios";
import FormData from "form-data";
import { Db, Collection } from "mongodb";
import { verifyAuth } from "../utils/verifyAuth";
import { generateId } from "../utils/generateId";
import { sendCreateChat } from "../utils/sendCreateChat";
import { getMongoClient } from "../models/mongoClient";

interface Chat {
  name: string;
  description: string;
  privacy: string;
  avatar: string | null;
  createdAt: string;
}

async function uploadAvatar(base64String: string): Promise<string> {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const form = new FormData();
  form.append("avatar", buffer, {
    filename: `avatar.${mimeType.split('/')[1]}`,
    contentType: mimeType,
  });

  const response = await axios.post("http://localhost:3004/upload_avatar", form, {
    headers: form.getHeaders(),
  });

  return response.data.url;
}

export function onCreateChat(socket: Socket, SECRET_KEY: string) {
  socket.on("create_chat", async (data: { chat: Chat }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      if (data.chat.avatar) {
        const avatarUrl = await uploadAvatar(data.chat.avatar);
        data.chat.avatar = avatarUrl;
      }

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      let chatId: string = generateId();
      while (await db.listCollections({ name: chatId }).hasNext()) {
        chatId = generateId();
      }

      const chatCollection: Collection = db.collection(chatId);

      await chatCollection.insertOne({
        _id: "config" as any,
        type: data.chat.privacy,
        avatar: data.chat.avatar,
        participants: [socket.data.userId],
        name: data.chat.name,
        createdAt: new Date().toISOString()
      });

      socket.emit("chat_created", { code: 1, chatId });

      sendCreateChat(socket.data.userId, chatId);

    } catch (error: unknown) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      socket.emit("chat_created", { code: 0, error: errorMessage });
      socket.disconnect();
    }
  });
}
