import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export const testUrlRegex = (url: string): boolean => {
  let regex = new RegExp(/^(http|https):\/\/[^ "]+$/);
  return regex.test(url);
};

/**
 *
 * @param url
 * @returns Promise<string> filepath of the downloaded image
 */
export const downloadImage = async (url: string): Promise<string> => {
  if (!testUrlRegex(url)) {
    throw new Error(`Invalid URL: ${url}`);
  }
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`${resp.statusText} - ${url}`);
  }

  const filename = url.split('/').pop();
  const filePath = `${process.cwd()}/storage/${filename}`;
  const writeStream = createWriteStream(filePath);
  await pipeline(resp.body as any, writeStream);
  return filePath;
};

/**
 *
 * @param urls list of urls to download images from
 * @returns Promise<{ success: number; errors: string[] }>
 */
export const downloadImages = async (
  urls: string[]
): Promise<{ success: number; errors: string[] }> => {
  const errors: string[] = [];
  let success = 0;

  const imgPromises: Promise<any>[] = [];
  urls.forEach((url) => {
    imgPromises.push(downloadImage(url));
  });
  const result = await Promise.allSettled(imgPromises);
  result.forEach((res) => {
    if (res.status === 'rejected') {
      errors.push(res.reason.message);
    } else {
      ++success;
    }
  });

  return { success, errors };
};
