import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { onAuthenticate } from './socket_events/onAuthenticate';
import { onDisconnect } from './socket_events/onDisconnect';
import { onError } from './socket_events/onError';
import { onGetStatus } from './socket_events/onGetStatus';

dotenv.config();

const onlineUsers = new Map<string, string>();

const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket: Socket) => {
  console.log('connection user', socket.id);

  onAuthenticate(socket, SECRET_KEY, onlineUsers);
  onGetStatus(socket, SECRET_KEY, onlineUsers)
  onDisconnect(socket, onlineUsers);
  onError(socket);
});

io.listen(PORT);
console.log(`server start on ${PORT}`);

io.engine.on('connection_error', (error) => {
  console.error('error Socket.IO:', error);
});
