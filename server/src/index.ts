import express, { Express, Request, Response } from 'express';

// index.ts

const app: Express = express();
const PORT: number = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('index1');
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
