import { Request, Response } from 'express';
import { processCsv } from '../lib/processFileUpload';
import { Worker } from 'worker_threads';
import { join } from 'path';
export class UploadController {
  public static async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    const filePath = req.file.path;
    res.header('Content-Type', 'application/json');
    let cb = (state: string) => {
      res.write(state);
    };
    await processCsv(filePath, cb);
    res.end();
  }

  public static async uploadWorker(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    res.header('Content-Type', 'application/json');
    const filePath = req.file.path;
    const worker = new Worker(
      join(__dirname, '..', 'workers/processCsvUpload.worker.js')
    );

    worker.postMessage({ filePath });
    worker.on('message', (message) => {
      res.write(message);
    });

    worker.on('error', (error) => {
      console.error(error);
    });

    worker.on('exit', (exitCode) => {
      if (exitCode != 0) {
        console.error(`It exited with code ${exitCode}`);
        res.end('error processing csv' + exitCode);
      } else {
        res.end();
      }
    });
  }
}
