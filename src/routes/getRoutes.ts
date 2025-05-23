import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.get('/register', (req: Request, res: Response) => {
  res.render('register');
});

export default router;
