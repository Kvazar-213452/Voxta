import { Socket } from 'socket.io-client';

export function registerKeyEvents(socket: Socket) {
  socket.on('send_message_return', (data) => {

  });
}
