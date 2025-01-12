import { Response } from 'express';
import { streamCsvFromDisk } from './streamCsvFromDIsk.service';
import { downloadImages } from './downloadImage.service';
import { processBatchOfDownloadPromises } from './processBatchOfPromises.service';

export const processCsv = async (
  filePath: string,
  res: Response
): Promise<void> => {
  // Start a csv read and streams
  const csvStream = streamCsvFromDisk(filePath);
  let errorsFetching: string[] = [];
  let success = 0;

  // Send initial data to client
  res.header('Content-Type', 'application/json');
  res.write(generateResponseObject(success, errorsFetching));

  let batch: Promise<any>[] = [];
  const batchsize = 10;

  // start downloading images, and process results every batchSize (10) (max of 50 images at once)
  for await (const row of csvStream) {
    delete row['sku'];
    batch.push(downloadImages(Object.values(row)));

    if (batch.length >= batchsize) {
      const { errors: batchErrors, success: batchSuccess } =
        await processBatchOfDownloadPromises(batch);
      success += batchSuccess;
      errorsFetching = errorsFetching.concat(batchErrors);
      res.write(generateResponseObject(success, errorsFetching));
      batch = [];
    }
  }

  // check if batch has residue items (count < batchSize)
  if (batch.length) {
    const { errors: batchErrors, success: batchSuccess } =
      await processBatchOfDownloadPromises(batch);
    success += batchSuccess;
    errorsFetching = errorsFetching.concat(batchErrors);
    res.write(generateResponseObject(success, errorsFetching));
    batch = [];
  }

  res.end(generateResponseObject(success, errorsFetching));
};

function generateResponseObject(success: number, errors: string[]): string {
  return JSON.stringify({
    success: true,
    message: `Successfully fetched ${success} images`,
    errors: errors,
  });
}
