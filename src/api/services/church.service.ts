import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class ChurchService {
  // Hierarchy
  async getHierarchy() {
    return prisma.union.findMany({
      include: {
        fields: {
          include: {
            districts: {
              include: {
                churches: true
              }
            }
          }
        }
      }
    });
  }

  // Union
  async getUnions() {
    return prisma.union.findMany();
  }

  async getUnionById(id: string) {
    return prisma.union.findUnique({ where: { id }, include: { fields: true } });
  }

  async createUnion(data: { name: string; location?: string }) {
    return prisma.union.create({ data });
  }

  async updateUnion(id: string, data: any) {
    return prisma.union.update({ where: { id }, data });
  }

  // Field
  async getFields(unionId?: string) {
    return prisma.field.findMany({
      where: unionId ? { unionId } : {}
    });
  }

  async getFieldById(id: string) {
    return prisma.field.findUnique({ where: { id }, include: { districts: true } });
  }

  async createField(data: { unionId: string; name: string; location?: string }) {
    return prisma.field.create({ data });
  }

  async updateField(id: string, data: any) {
    return prisma.field.update({ where: { id }, data });
  }

  // District
  async getDistricts(fieldId?: string) {
    return prisma.district.findMany({
      where: fieldId ? { fieldId } : {}
    });
  }

  async getDistrictById(id: string) {
    return prisma.district.findUnique({ where: { id }, include: { churches: true } });
  }

  async createDistrict(data: { fieldId: string; name: string; location?: string }) {
    return prisma.district.create({ data });
  }

  async updateDistrict(id: string, data: any) {
    return prisma.district.update({ where: { id }, data });
  }

  // Local Church
  async getChurches(districtId?: string) {
    return prisma.localChurch.findMany({
      where: districtId ? { districtId } : {}
    });
  }

  async getChurchById(id: string) {
    return prisma.localChurch.findUnique({ where: { id } });
  }

  async createChurch(data: { districtId: string; name: string; location?: string }) {
    return prisma.localChurch.create({ data });
  }

  async updateChurch(id: string, data: any) {
    return prisma.localChurch.update({ where: { id }, data });
  }

  // Coordination Meetings
  async createMeeting(data: {
    title: string;
    description?: string;
    meetingDate: Date;
    location?: string;
    churchLevel: string;
    churchId: string;
    organizerId: string;
  }, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.coordinationMeeting.create({ data });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'CREATE_COORDINATION_MEETING',
        resource: 'CoordinationMeeting',
        resourceId: result.id,
        details: `Created meeting: ${data.title} for ${data.churchLevel}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getMeetings(filters: any) {
    return prisma.coordinationMeeting.findMany({
      where: filters,
      include: { 
        organizer: { 
          select: { id: true, fullName: true, role: true } 
        } 
      },
      orderBy: { meetingDate: 'desc' }
    });
  }

  // Announcements
  async createAnnouncement(data: {
    title: string;
    content: string;
    targetType: string;
    targetId?: string;
    authorId: string;
    expiresAt?: Date;
  }, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.announcement.create({ data });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'CREATE_ANNOUNCEMENT',
        resource: 'Announcement',
        resourceId: result.id,
        details: `Created announcement: ${data.title}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getAnnouncements(filters: any) {
    return prisma.announcement.findMany({
      where: filters,
      include: { 
        author: { 
          select: { id: true, fullName: true, role: true } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Aggregated Regional Reporting (Regional stats)
  async getRegionalStats(level: string, id: string) {
    const where: any = {};
    if (level === 'union') where.unionId = id;
    if (level === 'field') where.fieldId = id;
    if (level === 'district') where.districtId = id;
    if (level === 'church') where.churchId = id;

    const [candidatesCount, baptizedCount, membersCount] = await Promise.all([
      prisma.candidate.count({ where: { user: where } }),
      prisma.candidate.count({ where: { user: where, status: 'baptized' } }),
      prisma.member.count({ where: { user: where } })
    ]);

    return {
      candidatesCount,
      baptizedCount,
      membersCount,
      baptismRate: candidatesCount > 0 ? (baptizedCount / candidatesCount) * 100 : 0
    };
  }

  // Inter-church communication (CommunicationLog)
  async logCommunication(data: {
    senderId: string;
    recipientId: string;
    subject?: string;
    content: string;
  }) {
    return prisma.communicationLog.create({
      data,
      include: {
        sender: { select: { fullName: true, role: true } },
        recipient: { select: { fullName: true, role: true } }
      }
    });
  }

  async getCommunicationLogs(userId: string) {
    return prisma.communicationLog.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      include: {
        sender: { select: { fullName: true, role: true } },
        recipient: { select: { fullName: true, role: true } }
      },
      orderBy: { sentAt: 'desc' }
    });
  }
}
