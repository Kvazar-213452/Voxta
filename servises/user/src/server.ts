import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import publicRouter from './routes/public';
import authRouter from './routes/auth';
import { setupSocket } from './socket';
import CONFIG from './config';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use(publicRouter);
app.use(authRouter);

setupSocket(io);

server.listen(CONFIG.port, () => {
    console.log(`Server run on http://localhost:${CONFIG.port}`);
});
