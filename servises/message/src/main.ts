import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? 'default-secret-key';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Створюємо Socket.IO сервер
const io = new Server({
  cors: {
    origin: "*", // Налаштуйте правильно для продакшена
    methods: ["GET", "POST"]
  }
});

// Обробка підключень WebSocket
io.on('connection', (socket: Socket) => {
  console.log('Користувач підключився:', socket.id);

  // Обробник аутентифікації
  socket.on('authenticate', (data: { token: string }) => {
    try {
      const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };
      console.log(`Користувач ${decoded.id_user} аутентифікований.`);
      
      // Зберігаємо ID користувача в об'єкті сокета для подальшого використання
      socket.data.userId = decoded.id_user;
      
      socket.emit('authenticated', { 
        status: 'ok',
        userId: decoded.id_user
      });
    } catch (error) {
      console.log('Невірний токен:', error);
      socket.emit('authenticated', { 
        status: 'error', 
        message: 'Невірний токен' 
      });
      socket.disconnect();
    }
  });

  // Обробник відключення
  socket.on('disconnect', () => {
    console.log('Користувач відключився:', socket.id, 
                socket.data.userId ? `(ID: ${socket.data.userId})` : '');
  });

  // Обробка помилок
  socket.on('error', (error) => {
    console.error('Помилка сокета:', error);
  });
});

// Запуск сервера
io.listen(PORT);
console.log(`Сервер Socket.IO запущений на порті ${PORT}`);

// Обробка помилок сервера
io.engine.on('connection_error', (error) => {
  console.error('Помилка сервера Socket.IO:', error);
});