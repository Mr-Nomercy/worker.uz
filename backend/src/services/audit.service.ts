import prisma from '../utils/prisma';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTER'
  | 'PASSWORD_CHANGE'
  | 'PHONE_REVEAL'
  | 'CV_UPLOAD'
  | 'PROFILE_UPDATE'
  | 'JOB_CREATE'
  | 'JOB_UPDATE'
  | 'JOB_DELETE'
  | 'APPLICATION_SUBMIT'
  | 'APPLICATION_UPDATE'
  | 'COMPANY_VERIFY'
  | 'COMPANY_REJECT'
  | 'CONTACT_REQUEST'
  | 'CONTACT_ACCEPT'
  | 'CONTACT_REJECT';

export type EntityType = 'USER' | 'PROFILE' | 'COMPANY' | 'JOB' | 'APPLICATION' | 'CONTACT_REQUEST';

export interface AuditLogInput {
  userId: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  async log(input: AuditLogInput): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: input.userId,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          details: input.details as object,
          ipAddress: input.ipAddress || 'unknown',
          userAgent: input.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  async logLogin(userId: string, method: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: userId,
      details: { method },
      ipAddress,
      userAgent,
    });
  }

  async logLogout(userId: string, ipAddress?: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGOUT',
      entityType: 'USER',
      entityId: userId,
      ipAddress,
    });
  }

  async logPhoneReveal(candidateId: string, employerId: string, jobId?: string): Promise<void> {
    await this.log({
      userId: employerId,
      action: 'PHONE_REVEAL',
      entityType: 'PROFILE',
      entityId: candidateId,
      details: { candidateId, jobId },
    });
  }

  async logProfileUpdate(userId: string, fields: string[]): Promise<void> {
    await this.log({
      userId,
      action: 'PROFILE_UPDATE',
      entityType: 'PROFILE',
      entityId: userId,
      details: { updatedFields: fields },
    });
  }

  async logCompanyVerification(companyId: string, adminId: string, isVerified: boolean, reason?: string): Promise<void> {
    await this.log({
      userId: adminId,
      action: isVerified ? 'COMPANY_VERIFY' : 'COMPANY_REJECT',
      entityType: 'COMPANY',
      entityId: companyId,
      details: { reason },
    });
  }

  async logContactRequest(fromUserId: string, toUserId: string, jobId?: string): Promise<void> {
    await this.log({
      userId: fromUserId,
      action: 'CONTACT_REQUEST',
      entityType: 'CONTACT_REQUEST',
      entityId: toUserId,
      details: { targetUserId: toUserId, jobId },
    });
  }

  async getAuditLogs(options: {
    userId?: string;
    action?: AuditAction;
    entityType?: EntityType;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, entityType, startDate, endDate, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      };
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}

export const auditService = new AuditService();
