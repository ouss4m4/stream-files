import { Request, Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { fileUpload } from '../middleware/fileUpload.middleware';

const uploadRouter = Router();

uploadRouter.post('/', fileUpload.single('file'), UploadController.upload);
uploadRouter.post(
  '/worker',
  fileUpload.single('file'),
  UploadController.uploadWorker
);

export { uploadRouter };
