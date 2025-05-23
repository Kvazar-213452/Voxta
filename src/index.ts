import express, { Express } from 'express';
import path from 'path';
import getRoutes from './routes/getRoutes';
import postRoutes from './routes/postRoutes';

// index.ts

const app: Express = express();
const PORT: number = 3000;

app.use(express.static(path.join(__dirname, 'web/public')));

app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', getRoutes);
app.use('/', postRoutes);

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
