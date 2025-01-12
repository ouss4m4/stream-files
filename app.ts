import express from 'express';
import { uploadRouter } from './router/upload.router';

const app = express();

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

app.use('/upload', uploadRouter);

export { startServer };
