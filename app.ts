import express from 'express';
import { uploadRouter } from './router/upload.router';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

console.log(`Worker ${process.pid} started`);

app.use('/upload', uploadRouter);

export { startServer };
