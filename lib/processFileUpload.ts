import { streamCsvFromDisk } from './streamCsvFromDisk';
import { downloadImages } from './downloadImage';
import { processBatchOfDownloadPromises } from './processBatchOfPromises';

export const processCsv = async (
  filePath: string,
  cb: (state: string) => void
): Promise<void> => {
  // Start a csv read and streams
  const csvStream = streamCsvFromDisk(filePath);
  let errorsFetching: string[] = [];
  let success = 0;

  // Send initial data to client

  cb(generateResponseObject(success, errorsFetching));

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
      cb(generateResponseObject(success, errorsFetching));
      batch = [];
    }
  }

  // check if batch has residue items (count < batchSize)
  if (batch.length) {
    const { errors: batchErrors, success: batchSuccess } =
      await processBatchOfDownloadPromises(batch);
    success += batchSuccess;
    errorsFetching = errorsFetching.concat(batchErrors);
    cb(generateResponseObject(success, errorsFetching));
    batch = [];
  }
};

function generateResponseObject(success: number, errors: string[]): string {
  return JSON.stringify({
    success: true,
    message: `Successfully fetched ${success} images`,
    errors: errors,
  });
}
