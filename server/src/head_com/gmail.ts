import fs from 'fs';
import nodemailer from 'nodemailer';

interface Config {
  sender: string;
  password: string;
}

const configData: Config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const { sender, password } = configData;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: password
  }
});

async function sendTextEmail(message: string, subject: string, receiver: string): Promise<string> {
  try {
    const mailOptions = {
      from: sender,
      to: receiver,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);
    return "The text message was sent successfully!";
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export default sendTextEmail;
