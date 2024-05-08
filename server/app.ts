import 'dotenv/config';
import express from 'express';

const app = express();

app.get('/healthcheck', (_req, res) => {
  res.send("I'm healthy");
});

export default app;
