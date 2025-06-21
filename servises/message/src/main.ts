import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket: Socket) => {
  console.log('Користувач підключився:', socket.id);

  socket.on('authenticate', (data: { token: string }) => {
    console.log('Отримано authenticate:', data);

    try {
      const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };
      console.log(`Користувач ${decoded.id_user} аутентифікований.`);
      socket.data.userId = decoded.id_user;
      socket.emit('authenticated', { status: 'ok', userId: decoded.id_user });
    } catch (error) {
      console.log('Невірний токен:', error);
      socket.emit('authenticated', { status: 'error', message: 'Невірний токен' });
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    console.log('Користувач відключився:', socket.id, 
                socket.data.userId ? `(ID: ${socket.data.userId})` : '');
  });

  socket.on('error', (error) => {
    console.error('Помилка сокета:', error);
  });
});

io.listen(PORT);
console.log(`server msg start on ${PORT}`);

io.engine.on('connection_error', (error) => {
  console.error('error Socket.IO:', error);
});