import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Voxta API is working!1');
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
