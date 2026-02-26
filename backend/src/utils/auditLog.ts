import { Request } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';

interface AuditLogData {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export const logAction = async (data: AuditLogData): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details || {},
        ipAddress: data.ipAddress || 'unknown',
        userAgent: data.userAgent || 'unknown',
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

export const createAuditLogFromRequest = async (
  req: Request,
  action: string,
  entityType: string,
  entityId: string,
  details?: Prisma.InputJsonValue
): Promise<void> => {
  const userId = (req as any).user?.id;
  
  await logAction({
    userId,
    action,
    entityType,
    entityId,
    details,
    ipAddress: req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });
};

export const AuditActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  
  REVEAL_PHONE: 'REVEAL_PHONE',
  SEARCH_CANDIDATES: 'SEARCH_CANDIDATES',
  CONTACT_REQUEST: 'CONTACT_REQUEST',
  CONTACT_REQUEST_ACCEPT: 'CONTACT_REQUEST_ACCEPT',
  CONTACT_REQUEST_REJECT: 'CONTACT_REQUEST_REJECT',
  
  CREATE_JOB: 'CREATE_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  
  CREATE_APPLICATION: 'CREATE_APPLICATION',
  WITHDRAW_APPLICATION: 'WITHDRAW_APPLICATION',
  
  VERIFY_COMPANY: 'VERIFY_COMPANY',
  REJECT_COMPANY: 'REJECT_COMPANY',
  
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPLOAD_CV: 'UPLOAD_CV',
  
  UPDATE_AI_CONFIG: 'UPDATE_AI_CONFIG',
} as const;

export type AuditAction = typeof AuditActions[keyof typeof AuditActions];
