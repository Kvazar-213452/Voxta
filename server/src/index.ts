import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';

interface Config {
    sender: string;
    password: string;
    version: string;
}

interface UserData {
    name: string;
    pasw?: string;
    gmail?: string;
    code?: string;
    acsses?: string;
    status?: string;
    key?: any[] | [string, string][];
}

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}


const app = express();
app.use(express.json());

// Load config
const config: Config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.sender,
        pass: config.password
    }
});


// Routes
app.post('/register', async (req: Request, res: Response) => {
    try {
        const data =req.body;
        console.log(data)

        const subject = "Notification";
        const message = `Code: 1111111111`;

        console.log(message)

        const mailOptions: MailOptions = {
            from: config.sender,
            to: "kvazar382@gmail.com",
            subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        res.json({ status: 'success', message: 'The text message was sent successfully!' });
    } catch (error: any) {
        res.json({ status: 'error', message: error.message });
    }
});

app.post('/version', (req: Request, res: Response) => {
    res.json({ version: config.version });
});

app.post('/check', (req: Request, res: Response) => {
    res.json({ version: null });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});