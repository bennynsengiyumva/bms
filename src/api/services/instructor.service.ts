import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class InstructorService {
  async getInstructors(filters: any) {
    return prisma.user.findMany({
      where: {
        role: 'instructor',
        ...filters,
      },
      include: {
        instructorProfile: true,
        _count: {
          select: { instructedCandidates: true },
        },
      },
    });
  }

  async getInstructorById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        instructorProfile: {
          include: { trainings: true },
        },
        instructedCandidates: {
          include: {
            user: true,
            lessons: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, data: any, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.instructorProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'UPDATE_INSTRUCTOR_PROFILE',
            resource: 'InstructorProfile',
            resourceId: result.id,
            details: JSON.stringify(data),
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async addTraining(instructorProfileId: string, data: any, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.instructorTraining.create({
      data: {
        instructorProfileId,
        ...data,
      },
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'ADD_INSTRUCTOR_TRAINING',
            resource: 'InstructorTraining',
            resourceId: result.id,
            details: `Added training: ${data.trainingName}`,
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async getInstructorMetrics(userId: string) {
    const instructor = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructedCandidates: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!instructor) throw new Error('Instructor not found');

    const totalCandidates = instructor.instructedCandidates.length;
    const baptizedCount = instructor.instructedCandidates.filter(
      (c) => c.status === 'baptized'
    ).length;

    const totalLessonsCount = await prisma.bibleLesson.count();
    let totalProgress = 0;
    instructor.instructedCandidates.forEach((c) => {
      const completed = c.lessons.filter((l) => l.completionDate).length;
      totalProgress += totalLessonsCount > 0 ? (completed / totalLessonsCount) * 100 : 0;
    });

    return {
      totalCandidates,
      baptizedCount,
      baptismRate: totalCandidates > 0 ? (baptizedCount / totalCandidates) * 100 : 0,
      averageProgress: totalCandidates > 0 ? totalProgress / totalCandidates : 0,
    };
  }

  /**
   * Communications
   */
  async logCommunication(data: {
    senderId: string;
    recipientId: string;
    subject?: string;
    content: string;
  }, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.communicationLog.create({
      data: {
        senderId: data.senderId,
        recipientId: data.recipientId,
        subject: data.subject,
        content: data.content,
      },
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'LOG_COMMUNICATION',
            resource: 'CommunicationLog',
            resourceId: result.id,
            details: `Sent communication from ${data.senderId} to ${data.recipientId}`,
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async getCommunications(userId: string) {
    return prisma.communicationLog.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: { select: { fullName: true } },
        recipient: { select: { fullName: true } },
      },
      orderBy: { sentAt: 'desc' },
    });
  }
}
