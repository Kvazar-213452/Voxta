import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import session from 'express-session';
import publicRouter from './routes/public';
import authRouter from './routes/auth';
import CONFIG from './config';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

app.use(express.json());

app.use(publicRouter);
app.use(authRouter);

server.listen(CONFIG.port, () => {
    console.log(`Server run on http://localhost:${CONFIG.port}`);
});
