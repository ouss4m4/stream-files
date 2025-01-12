export const processBatchOfDownloadPromises = async (
  batch: Promise<{ success: number; errors: string[] }>[]
): Promise<{ success: number; errors: string[] }> => {
  let errors: any[] = [];
  let success = 0;
  (await Promise.allSettled(batch)).forEach((res) => {
    if (res.status === 'rejected') {
      console.error(res.reason);
    } else {
      errors = errors.concat(res.value.errors);
      success += res.value.success;
    }
  });
  return { success, errors };
};
