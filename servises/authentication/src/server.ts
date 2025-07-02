import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import publicRouter from './routes/public';
import authRouter from './routes/auth';
import CONFIG from './config';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(publicRouter);
app.use(authRouter);

server.listen(CONFIG.PORT, () => {
    console.log(`Server run on http://localhost:${CONFIG.PORT}`);
});
