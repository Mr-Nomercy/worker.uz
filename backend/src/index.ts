import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';
import matchingRoutes from './routes/matching.routes';
import aiRoutes from './routes/ai.routes';
import profileRoutes from './routes/profile.routes';

import { AppError } from './utils/apiResponse';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏛️  Worker API Server                                   ║
║                                                           ║
║   Status:     Running                                     ║
║   Port:       ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                           ║
║   Endpoints:                                             ║
║   - POST   /api/auth/login                               ║
║   - GET    /api/auth/me                                  ║
║   - GET    /api/jobs                                     ║
║   - POST   /api/jobs                                     ║
║   - POST   /api/applications                             ║
║   - GET    /api/applications/my-applications             ║
║   - GET    /api/admin/metrics                            ║
║   - GET    /api/admin/audit-logs                         ║
║   - GET    /api/matching/jobs                            ║
║   - GET    /api/matching/candidates/:jobId               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
