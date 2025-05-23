import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import getRoutes from './routes/getRoutes';
import postRoutes from './routes/postRoutes';

const app: Express = express();
const PORT: number = 3000;

app.use(express.static(path.join(__dirname, 'web/public')));
app.use(express.json());

app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.endsWith('_post')) {
    postRoutes(req, res, next);
  } else {
    getRoutes(req, res, next);
  }
});

app.listen(PORT, () => {
  console.log(`Site started: http://localhost:${PORT}`);
});