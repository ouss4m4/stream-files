import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

export const streamCsvFromDisk = (filePath: string) => {
  return createReadStream(filePath).pipe(parse({ columns: true }));
};
