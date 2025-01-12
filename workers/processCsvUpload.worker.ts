import { parentPort } from 'worker_threads';
import { processCsv } from '../lib/processFileUpload';

parentPort?.on('message', async ({ filePath }) => {
  console.log(`Received file path: ${filePath}`);

  // Process the filePath here, e.g., reading a file or performing a task.
  //   const result = `Processed file: ${filePath}`;
  //   await processCsv(filePath, res);
  // Send a message back to the main thread with the result.
  //   parentPort?.postMessage({ status: 'success', result });
});

// Optional: Handle uncaught errors or unexpected behavior.
process.on('uncaughtException', (err) => {
  console.error('Worker encountered an error:', err);
  parentPort?.postMessage({ status: 'error', error: err.message });
});
