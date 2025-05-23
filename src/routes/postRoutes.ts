import { Router, Request, Response } from 'express';

const router = Router();

router.post('/submit-text', (req: Request, res: Response) => {
  const { text } = req.body;
  console.log('Received text:', text);
  res.send(`Text received: ${text}`);
});

export default router;
