import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { v4 as requestId } from 'uuid';

import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';
import matchingRoutes from './routes/matching.routes';
import aiRoutes from './routes/ai.routes';
import profileRoutes from './routes/profile.routes';

import { errorMiddleware, notFoundHandler } from './errors';
import { initializeSocket } from './socket/socket';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration from environment
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Structured request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = requestId();
  res.setHeader('X-Request-ID', reqId);
  
  logger.info({
    type: 'request',
    requestId: reqId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  next();
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Make io available in routes
app.set('io', io);

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
app.use(errorMiddleware);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏛️  Worker API Server                                   ║
║                                                           ║
║   Status:     Running                                     ║
║   Port:       ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   Socket.io:  Enabled                                      ║
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
