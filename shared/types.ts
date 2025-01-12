export interface CsvRow {
  sku: string;
  'Image 1': string;
  'Image 2': string;
  'Image 3': string;
  'Image 4': string;
  'Image 5': string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  errors: string[];
}
