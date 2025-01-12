import { Readable } from 'stream';
import {
  testUrlRegex,
  downloadImage,
  downloadImages,
} from '../services/downloadImage.service';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

jest.mock('stream/promises', () => ({
  pipeline: jest.fn(),
}));

describe('downloadImage.service', function () {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it('should test url with a regex', () => {
    const correctUrl = 'https://example.com?image.png';

    expect(testUrlRegex(correctUrl)).toBe(true);

    const badUrl = 'htt://badformat.com';
    expect(testUrlRegex(badUrl)).toBe(false);
  });

  it('should download image and return filepath', async () => {
    const mockBody = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([97, 98, 99]));
        controller.close();
      },
    });
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockBody,
    } as Response);

    const mockWriter = {
      write: jest.fn(),
      end: jest.fn(),
    };

    (createWriteStream as jest.Mock).mockReturnValue(mockWriter);

    // Mock pipeline
    const mockPipeline = jest.fn().mockResolvedValueOnce(undefined);
    (pipeline as jest.Mock).mockImplementation(mockPipeline);

    let correctUrl = 'https://example.com/image1.png';
    let expectedFilePath = `${process.cwd()}/storage/image1.png`;

    const response = await downloadImage(correctUrl);
    expect(createWriteStream).toHaveBeenCalledWith(expectedFilePath);
    expect(fetch).toHaveBeenCalledWith(correctUrl);
    // TODO: .toHaveBeenCalledWith(mockBody, mockWriter)
    expect(pipeline).toHaveBeenCalled();
    expect(response).toBe(expectedFilePath);
  });

  it('should throw error when downloading image', async () => {
    let fetchError = {
      ok: false,
      statusText: 'failed to fetch',
    };
    jest.spyOn(global, 'fetch').mockRejectedValue(fetchError);

    let badUrl = 'https://example.com/notfound.png';

    await expect(downloadImage(badUrl)).rejects.toEqual(fetchError);
    expect(fetch).toHaveBeenCalledWith(badUrl);
    expect(createWriteStream).not.toHaveBeenCalled();
    expect(pipeline).not.toHaveBeenCalled();
  });

  it('should download list of images and return expected result', async () => {
    const sampleUrls = [
      'badurl.com',
      'http://goodurl.com/image2.jpg',
      '',
      'https://example.com?image1.png',
      '',
    ];

    const expectedResults = {
      success: 2,
      errors: [
        'failed to fetch badurl.com',
        'failed to fetch ',
        'failed to fetch',
      ],
    };

    const downloadImageMock = jest.spyOn(
      require('../services/downloadImage.service'),
      'downloadImage'
    );
    downloadImageMock
      .mockRejectedValueOnce(new Error('failed to fetch badurl.com'))
      .mockResolvedValueOnce(`${process.cwd()}/storage/image2.jpg`)
      .mockRejectedValueOnce(new Error('failed to fetch '))
      .mockResolvedValueOnce(`${process.cwd()}/storage/image1.png`)
      .mockRejectedValueOnce(new Error('failed to fetch'));

    const result = await downloadImages(sampleUrls);

    expect(downloadImage).toHaveBeenCalledTimes(sampleUrls.length);
    expect(result).toEqual(expectedResults);
  });
});
