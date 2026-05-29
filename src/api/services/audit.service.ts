import prisma from '../models/prisma';

export class AuditService {
  async logAction(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data,
    });
  }

  async getLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate, ...otherFilters } = filters;
    
    return prisma.auditLog.findMany({
      where: {
        ...otherFilters,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
