import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class SpiritualService {
  /**
   * Spiritual Growth Logs
   */
  async logSpiritualGrowth(data: {
    candidateId: string;
    logType: string;
    content: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.spiritualGrowthLog.create({
      data,
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'LOG_SPIRITUAL_GROWTH',
        resource: 'SpiritualGrowthLog',
        resourceId: result.id,
        details: `Logged ${data.logType} for candidate ${data.candidateId}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getCandidateLogs(candidateId: string) {
    return prisma.spiritualGrowthLog.findMany({
      where: { candidateId },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async getLogById(id: string) {
    return prisma.spiritualGrowthLog.findUnique({
      where: { id },
    });
  }

  async updateLog(id: string, data: {
    logType?: string;
    content?: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.spiritualGrowthLog.update({
      where: { id },
      data,
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'UPDATE_SPIRITUAL_LOG',
        resource: 'SpiritualGrowthLog',
        resourceId: id,
        details: `Updated spiritual growth log`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async deleteLog(id: string, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.spiritualGrowthLog.delete({
      where: { id },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'DELETE_SPIRITUAL_LOG',
        resource: 'SpiritualGrowthLog',
        resourceId: id,
        details: `Deleted spiritual growth log`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  /**
   * Baptism Interviews
   */
  async scheduleInterview(data: {
    candidateId: string;
    interviewerId: string;
    interviewDate: Date;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.baptismInterview.create({
      data: {
        candidateId: data.candidateId,
        interviewerId: data.interviewerId,
        interviewDate: data.interviewDate,
      },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'SCHEDULE_BAPTISM_INTERVIEW',
        resource: 'BaptismInterview',
        resourceId: result.id,
        details: `Scheduled interview for candidate ${data.candidateId} on ${data.interviewDate}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async recordInterviewResult(id: string, data: {
    readinessScore: number;
    feedback: string;
    isReady: boolean;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const interview = await prisma.baptismInterview.update({
      where: { id },
      data,
    });

    if (data.isReady) {
      await prisma.candidate.update({
        where: { id: interview.candidateId },
        data: { status: 'ready' }
      });
    }

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'RECORD_INTERVIEW_RESULT',
        resource: 'BaptismInterview',
        resourceId: id,
        details: `Readiness: ${data.isReady}, Score: ${data.readinessScore}`,
        ipAddress: context.ipAddress
      });
    }

    return interview;
  }

  async getCandidateInterviews(candidateId: string) {
    return prisma.baptismInterview.findMany({
      where: { candidateId },
      include: { interviewer: true },
      orderBy: { interviewDate: 'desc' },
    });
  }

  async getInterviewById(id: string) {
    return prisma.baptismInterview.findUnique({
      where: { id },
      include: { 
        interviewer: true,
        candidate: {
          include: {
            user: true
          }
        }
      },
    });
  }
}
