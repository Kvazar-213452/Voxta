import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { initKeyLite, getKeyLite } from './utils/cripto/SPX_CriptoLite';
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
import { onGetFriends } from './socketEvents/onGetFriends';
import { onDelFriend } from './socketEvents/onDelFriend';
import { onAddUserInChat } from './socketEvents/onAddUserInChat';

dotenv.config();

const EXPRESS_PORT = parseInt(process.env.PORT_SERVER || '3000');
const SOCKET_PORT = parseInt(process.env.PORT || '3001');
const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';

// ------------------------
// EXPRESS SERVER
// ------------------------
const app = express();

initKeyLite();

app.get('/public_key_lite', (req: Request, res: Response) => {
  res.json({ key: getKeyLite().publicKey });
});

app.listen(EXPRESS_PORT, () => {
  console.log(`Express API запущено на http://localhost:${EXPRESS_PORT}`);
});

// ------------------------
// SOCKET.IO SERVER
// ------------------------
const socketServer = http.createServer();
const io = new Server(socketServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`Клієнт підключився: ${socket.id}`);

  onAuthenticate(socket, SECRET_KEY);
  onGetInfoChats(socket, SECRET_KEY);
  onLoadChatContent(socket, SECRET_KEY);
  onSendMessage(socket, SECRET_KEY);
  onCreateChat(socket, SECRET_KEY);
  onGetInfoUsers(socket, SECRET_KEY);
  onGetInfoUser(socket, SECRET_KEY);
  onGetInfoChat(socket, SECRET_KEY);
  onGetFriends(socket, SECRET_KEY);
  onDelFriend(socket, SECRET_KEY);
  onAddUserInChat(socket, SECRET_KEY);
  onDisconnect(socket);
  onError(socket);
});

export function getIO(): Server {
  return io;
}

socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO запущено на http://localhost:${SOCKET_PORT}`);
});

io.engine.on('connection_error', (error) => {
  console.error('Socket.IO помилка з’єднання:', error);
});
