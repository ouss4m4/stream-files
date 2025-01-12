import { Request, Response } from 'express';
import { processCsv } from '../services/processFileUpload.service';

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
}
