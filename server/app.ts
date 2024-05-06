import 'dotenv/config';
import express from 'express';
import getTodoListData from './handlers/getTodoListData.ts';

const UNKNOWN_ERROR = 'An error has occurred, please try again';
//TODO: DRY ^ move error handling stuff to shared folder

const app = express();

app.get('/healthcheck', (_req, res) => {
  res.send("I'm healthy");
});

app.get('/api/wallet', async (_req, res) => {
  try {
    const response = await getTodoListData();
    const { taskList, taskCount } = response;
    res.json({ taskList, taskCount });
  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
    else res.status(500).json({ message: UNKNOWN_ERROR });
  }
});

export default app;
