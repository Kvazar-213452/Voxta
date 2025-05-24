import { Router, Request, Response } from 'express';

// get_routes.ts

const router = Router();

router.get('/', (req: Request, res: Response) => {
  if (req.session.login === 1) {
    res.render('index');
  } else {
    res.render('login/login');
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login/login');
});

router.get('/register', (req: Request, res: Response) => {
  res.render('login/register');
});

router.get('/register_end', (req: Request, res: Response) => {
  res.render('login/register_end');
});

export default router;
