import { Router } from 'express';
import aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get AI career advice for a specific job
// Query param: lang=uz (default) or lang=ru
router.get('/ai-advice/:jobId', aiController.getAIAdvice);

export default router;
