import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { send_gmail } from './head_com/gmail';

const PORT: string | number = 3001;

interface ResponseData {
    status: string;
    message?: string;
    version?: string;
}

dotenv.config();

const app: Express = express();
app.use(express.json());

if (!process.env.VERSION) {
    throw new Error('Missing VERSION in environment variables.');
}

app.post('/register', async (req: Request, res: Response<ResponseData>) => {
    try {
        const data = req.body.data;

        await send_gmail(data[1], data[0]);

        res.json({ status: 'success', message: 'The text message was sent successfully!' });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
