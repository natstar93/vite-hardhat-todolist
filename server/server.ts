import app from './app.ts';
import ViteExpress from "vite-express";

const PORT = 3000;

ViteExpress.listen(app, PORT, () => {
  console.info(`App listening on port ${PORT}`);
});

export default app;
