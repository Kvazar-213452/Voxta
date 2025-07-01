import { getIO } from '../main';

export function sendCreateChat(userId: string, id: string) {
  getIO().sockets.sockets.forEach((socket) => {
    if (socket.data.userId === userId) {
      socket.emit("create_new_chat", { code: 1, chatId: id });
    }
  });
}
