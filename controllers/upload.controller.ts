import { Request, Response } from 'express';
import { streamCsvFromDisk } from '../services/streamCsvFromDIsk.service';
import { downloadImages } from '../services/downloadImage.service';
import { CsvRow, UploadResponse } from '../shared/types';

export class UploadController {
  public static async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    const filePath = req.file.path;
    // TODO: spawn a worker to process the file 1 worker/file
    const csvStream = streamCsvFromDisk(filePath);
    let errorsFetching: string[] = [];
    let success = 0;
    for await (const row of csvStream) {
      // dispatch all images in a single row at once
      delete row['sku'];
      const rowResult = await downloadImages(Object.values(row));
      errorsFetching = errorsFetching.concat(rowResult.errors);
      success += rowResult.success;
    }

    const result: UploadResponse = {
      success: true,
      message: `Successfully fetched ${success} images`,
      errors: errorsFetching,
    };
    res.json(result);
  }
}
