import { parentPort } from 'worker_threads';
import { processCsv } from '../lib/processFileUpload';

parentPort?.on('message', async ({ filePath }) => {
  console.log(`Received file path: ${filePath}`);

  const cb = (state: string) => {
    parentPort?.postMessage(state);
  };
  await processCsv(filePath, cb);
  process.exit(0);
});

// Optional: Handle uncaught errors or unexpected behavior.
process.on('uncaughtException', (err) => {
  console.error('Worker encountered an error:', err);
  process.exit(2);
});
