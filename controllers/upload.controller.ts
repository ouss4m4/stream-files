import { Request, Response } from 'express';
import { processCsv } from '../lib/processFileUpload';

export class UploadController {
  public static async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    const filePath = req.file.path;
    // TODO: spawn a worker to process this process
    const response = await processCsv(filePath, res);
  }

  public static async uploadWorker(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send('No files were uploaded.');
      return;
    }

    const filePath = req.file.path;
    // TODO: spawn a worker to process this process
    const response = await processCsv(filePath, res);
  }
}
