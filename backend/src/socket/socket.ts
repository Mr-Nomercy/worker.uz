import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserSocket {
  [userId: string]: string;
}

const userSockets: UserSocket = {};

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'worker-secret-key') as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
    
    // Join a room with the user's ID for private notifications
    socket.join(userId);
    userSockets[userId] = socket.id;

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      delete userSockets[userId];
    });
  });

  return io;
};

export const sendNotificationToUser = (io: Server, userId: string, notification: {
  id: string;
  title: string;
  message: string;
  type: string;
}) => {
  // Send to the user's room
  io.to(userId).emit('new_notification', notification);
  console.log(`Notification sent to user ${userId}: ${notification.title}`);
};

export const sendContactRequestNotification = async (io: Server, candidateId: string, employerName: string) => {
  const notification = await prisma.notification.create({
    data: {
      userId: candidateId,
      title: 'Yangi bog\'lanish so\'rovi',
      message: `${employerName} siz bilan bog\'lanmoqchi`,
      type: 'info',
    },
  });

  sendNotificationToUser(io, candidateId, {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
  });

  return notification;
};

export { userSockets };
