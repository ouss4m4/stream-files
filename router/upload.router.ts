import { Request, Router } from 'express';
import { UploadController } from '../controllers/upload.controller';

const uploadRouter = Router();

uploadRouter.post('/', UploadController.upload);

export { uploadRouter };
