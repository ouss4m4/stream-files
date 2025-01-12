import { processBatchOfDownloadPromises } from '../services/processBatchOfPromises.service';

describe('processBatchOfPromises', () => {
  it('Should await promises, and return proper result', async () => {
    const sampleArray = [
      new Promise<{ success: number; errors: string[] }>((resolve) =>
        resolve({
          success: 2,
          errors: ['failed to fetch url2', 'failed to fetch url3'],
        })
      ),
      new Promise<{ success: number; errors: string[] }>((resolve) =>
        resolve({
          success: 5,
          errors: [],
        })
      ),
      new Promise<{ success: number; errors: string[] }>((resolve) =>
        resolve({
          success: 0,
          errors: [
            'invalid url ',
            'invalid url ',
            'timeout fetch somewhere.com',
            'invalid url ',
            'invalid url ',
          ],
        })
      ),
    ];

    const expectedReponse: { success: number; errors: string[] } = {
      success: 7,
      errors: [
        'failed to fetch url2',
        'failed to fetch url3',
        'invalid url ',
        'invalid url ',
        'timeout fetch somewhere.com',
        'invalid url ',
        'invalid url ',
      ],
    };

    const result = await processBatchOfDownloadPromises(sampleArray);
    expect(result).toEqual(expectedReponse);
  });
});

// export const processBatchOfDownloadPromises = async (
//     batch: Promise<{ success: number; errors: string[] }>[]
//   ): Promise<{ success: number; errors: string[] }> => {
//     let errors: any[] = [];
//     let success = 0;
//     (await Promise.allSettled(batch)).forEach((res) => {
//       if (res.status === 'rejected') {
//         console.error(res.reason);
//       } else {
//         errors = errors.concat(res.value.errors);
//         success += res.value.success;
//       }
//     });
//     return { success, errors };
//   };
