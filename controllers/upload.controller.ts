import { Request, Response } from 'express';

export class UploadController {
  public static async upload(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'File uploaded successfully' });
  }
}
