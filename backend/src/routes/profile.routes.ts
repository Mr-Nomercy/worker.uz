import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import profileController from '../controllers/profile.controller';
import { uploadCV, uploadLogo } from '../utils/upload';

const router = Router();

router.use(authenticate);

router.get('/me', profileController.getMyProfile);

router.patch('/update', profileController.updateProfile);

router.post('/resync', profileController.resyncGovData);

router.post('/upload-cv', uploadCV, profileController.uploadCV);

router.post('/upload-logo', uploadLogo, profileController.uploadLogo);

export default router;
