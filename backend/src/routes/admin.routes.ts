import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Metrics
router.get('/metrics', adminController.getMetrics);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

// Companies
router.get('/companies', adminController.getCompanies);
router.patch('/companies/:id/verify', adminController.verifyCompany);

// AI Config
router.get('/ai-config', adminController.getAIConfig);
router.patch('/ai-config', adminController.updateAIConfig);

// Users
router.get('/users', adminController.getUsers);

export default router;
