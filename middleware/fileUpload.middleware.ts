import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: `${process.cwd()}/uploads`,
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const fileUpload = multer({ storage });
