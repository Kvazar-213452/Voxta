import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { initKeyLite, getKeyLite } from './utils/crypto/SPX_CriptoLite';
import { onGetInfoChats } from './socketEvents/chat/onGetInfoChats';
import { onLoadChatContent } from './socketEvents/chat/onLoadChatContent';
import { onSendMessage } from './socketEvents/chat/onSendMessage';
import { onAuthenticate } from './socketEvents/server/onAuthenticate';
import { onDisconnect } from './socketEvents/server/onDisconnect';
import { onError } from './socketEvents/server/onError';
import { onCreateChat } from './socketEvents/chat/onCreateChat';
import { onGetInfoUsers } from './socketEvents/user/onGetInfoUsers';
import { onGetInfoUser } from './socketEvents/user/onGetInfoUser';
import { onGetInfoChat } from './socketEvents/chat/onGetInfoChat';
import { onGetFriends } from './socketEvents/friend/onGetFriends';
import { onDelFriend } from './socketEvents/friend/onDelFriend';
import { onAddUserInChat } from './socketEvents/chat/onAddUserInChat';
import { onDelMemberInChat } from './socketEvents/chat/onDelMemberInChat';
import { onSaveSettingsChat } from './socketEvents/chat/onSaveSettingsChat';
import { onFindFriend } from './socketEvents/friend/onFindFriend';
import { onAddFriend } from './socketEvents/friend/onAddFriend';
import { onCreateChatServer } from './socketEvents/chat/onCreateChatServer';
import { onNewChatCreateServer } from './socketEvents/chat/onNewChatCreateServer';
import { onGetPubLiteKeySIS } from './socketEvents/crypto/onGetPubLiteKeySIS';

dotenv.config();

const EXPRESS_PORT = parseInt(process.env.PORT_SERVER || '3000');
const SOCKET_PORT = parseInt(process.env.PORT || '3001');
export const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';

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
  console.log(`conect client: ${socket.id}`);

  onCreateChatServer(socket);
  onGetPubLiteKeySIS(socket);
  onNewChatCreateServer(socket);
  onAuthenticate(socket);
  onGetInfoChats(socket);
  onLoadChatContent(socket);
  onSendMessage(socket);
  onCreateChat(socket);
  onGetInfoUsers(socket);
  onGetInfoUser(socket);
  onGetInfoChat(socket);
  onGetFriends(socket);
  onDelFriend(socket);
  onAddUserInChat(socket);
  onDelMemberInChat(socket);
  onSaveSettingsChat(socket);
  onFindFriend(socket);
  onAddFriend(socket);
  onDisconnect(socket);
  onError(socket);
});

export function getIO(): Server {
  return io;
}

socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO start на http://localhost:${SOCKET_PORT}`);
});

io.engine.on('connection_error', (error) => {
  console.error('Socket.IO error:', error);
});
