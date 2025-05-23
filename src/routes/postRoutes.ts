import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

router.post('/register_post', async (req: Request, res: Response) => {
  try {
    const data = req.body.data;

    const response = await axios.post('http://localhost:3001/register', {
      data: data
    });

    console.log('Відповідь від сервера 3001:', response.data);

    res.send("ok");
  } catch (error) {
    console.error('Помилка при відправці на сервер 3001:', error);
    res.status(500).send("Помилка сервера");
  }
});

export default router;
