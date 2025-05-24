import express, { Express, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

interface ResponseData {
    status: string;
    message?: string;
    version?: string;
}

// Load environment variables
dotenv.config();

const app: Express = express();
app.use(express.json());

// Validate required environment variables
const requiredEnvVars = ['SENDER_EMAIL', 'SENDER_PASSWORD', 'VERSION', 'RECIPIENT_EMAIL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

// Routes
app.post('/register', async (req: Request, res: Response<ResponseData>) => {
    try {
        const data = req.body.data;

        console.log(data)

        const subject = "Notification";
        const message = `Code: ${data[1]}`;

        console.log(message);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: data[2],
            subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        res.json({ status: 'success', message: 'The text message was sent successfully!' });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error' });
    }
});

app.post('/version', (req: Request, res: Response<ResponseData>) => {
    res.json({ status: 'success', version: process.env.VERSION });
});

const PORT: string | number = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});