const nodemailer = require('nodemailer');
const fs = require('fs');

// Завантаження конфігурації
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.sender,
    pass: config.password,
  },
});

const mailOptions = {
  from: config.sender,
  to: 'kvazar382@gmail.com',
  subject: 'Notification',
  text: 'Code: 111111',
};

transporter.sendMail(mailOptions)
  .then(() => {
    console.log('The text message was sent successfully!');
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
