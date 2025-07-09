import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { onGetInfoChats } from './socketEvents/onGetInfoChats';
import { onLoadChatContent } from './socketEvents/onLoadChatContent';
import { onSendMessage } from './socketEvents/onSendMessage';
import { onAuthenticate } from './socketEvents/onAuthenticate';
import { onDisconnect } from './socketEvents/onDisconnect';
import { onError } from './socketEvents/onError';
import { onCreateChat } from './socketEvents/onCreateChat';
import { onGetInfoUsers } from './socketEvents/onGetInfoUsers';
import { onGetInfoUser } from './socketEvents/onGetInfoUser';
import { onGetInfoChat } from './socketEvents/onGetInfoChat';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

export function getIO(): Server {
  return io;
}

io.on('connection', (socket: Socket) => {
  console.log('connection user', socket.id);

  onAuthenticate(socket, SECRET_KEY);
  onGetInfoChats(socket, SECRET_KEY);
  onLoadChatContent(socket, SECRET_KEY);
  onSendMessage(socket, SECRET_KEY);
  onCreateChat(socket, SECRET_KEY);
  onGetInfoUsers(socket, SECRET_KEY);
  onGetInfoUser(socket, SECRET_KEY);
  onGetInfoChat(socket, SECRET_KEY)
  onDisconnect(socket);
  onError(socket);
});

io.listen(PORT);
console.log(`server start on ${PORT}`);

io.engine.on('connection_error', (error) => {
  console.error('error Socket.IO:', error);
});
