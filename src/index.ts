import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import getRoutes from './routes/get_routes';
import postRoutes from './routes/post_routes';
import CONFIG from './head_com/config';

// index.ts

const app: Express = express();

app.use(session({
    secret: '2143210-r4rf2ee32rferjtgprepot3re',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, 'web/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.endsWith('_post')) {
    postRoutes(req, res, next);
  } else {
    getRoutes(req, res, next);
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`Site started: http://localhost:${CONFIG.PORT}`);
});