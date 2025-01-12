import { Readable } from 'stream';
import { streamCsvFromDisk } from '../services/streamCsvFromDIsk.service';
import { createReadStream } from 'fs';

jest.mock('fs', () => ({
  createReadStream: jest.fn(),
}));

describe('streamCsvFromDisk.service', () => {
  it('should stream csv line by line', () => {
    let mockFilepath = '/uploads/test.csv';

    // Mock a CSV file with a single line of data
    const mockCsv = `sku,Image 1,Image 2,Image 3,Image 4,Image 5\nit001,image1.png,image2.png,,http://sample.com/img4.svg,https://example.com/image5.jpg`;
    const mockStream = new Readable({
      read() {
        this.push(mockCsv);
        this.push(null);
      },
    });

    (createReadStream as jest.Mock).mockReturnValue(mockStream);
    streamCsvFromDisk(mockFilepath);

    expect(createReadStream).toHaveBeenCalledWith(mockFilepath);
  });
});
