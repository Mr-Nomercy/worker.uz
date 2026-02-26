import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

const dirs = ['uploads/cv', 'uploads/logos'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/cv';
    
    if (file.fieldname === 'logo') {
      uploadPath = 'uploads/logos';
    }
    
    const fullPath = path.join(__dirname, '../../', uploadPath);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

type FileField = 'cv' | 'logo';

const allowedMimeTypes: Record<FileField, string[]> = {
  cv: ['application/pdf'],
  logo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const field = file.fieldname as FileField;
  const allowed = allowedMimeTypes[field] || [];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (field === 'cv' && ext !== '.pdf') {
    cb(new Error('CV faqat PDF formatida yuklanishi mumkin.'));
    return;
  }
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Noto'g'ri fayl turi. Ruxsat etilgan: ${allowed.join(', ')}`));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_CV_SIZE,
    fields: 10,
  }
}).single('cv');

export const uploadLogo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_LOGO_SIZE,
    fields: 10,
  }
}).single('logo');

export const getFileUrl = (filename: string, type: 'cv' | 'logo'): string => {
  const basePath = type === 'cv' ? '/uploads/cv' : '/uploads/logos';
  return `${basePath}/${filename}`;
};

export const deleteOldFile = (filePath: string): void => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
    }
  } catch (error) {
    console.error('Error deleting old file:', error);
  }
};

export const MAX_CV_SIZE_BYTES = MAX_CV_SIZE;
export const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE;
