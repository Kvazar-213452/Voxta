import express, { Express, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const PORT: number = 3000;

app.use(express.static(path.join(__dirname, 'web/public')));

app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
  res.render('index', { message: 'Voxta API is working!1' });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
