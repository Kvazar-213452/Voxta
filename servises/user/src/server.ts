import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import publicRouter from './routes/public';
import authRouter from './routes/auth';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.json());

// Підключаємо роутери
app.use(publicRouter);
app.use(authRouter);

// Ініціалізуємо Socket.IO
setupSocket(io);

server.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
