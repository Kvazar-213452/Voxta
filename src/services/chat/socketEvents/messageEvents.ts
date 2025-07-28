import { Socket } from 'socket.io-client';
import { getMainWindow } from '../../../models/mainWindow';

export function registerMessageEvents(socket: Socket) {
  socket.on('send_message_return', (data) => {
    if (data.code) {
      getMainWindow().webContents.send('reply', {
        type: 'came_chat_msg',
        message: data.message,
        chat_id: data.chatId
      });
    } else {
      getMainWindow().webContents.send('reply', { type: 'error_div', content: "send_message_return" });
    }
  });
}
