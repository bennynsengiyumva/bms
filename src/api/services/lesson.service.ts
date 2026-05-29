import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class LessonService {
  /**
   * Lesson Catalog Management
   */
  async getAllLessons() {
    return prisma.bibleLesson.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getLessonById(id: string) {
    return prisma.bibleLesson.findUnique({
      where: { id },
    });
  }

  async createLesson(data: {
    title: string;
    description?: string;
    orderIndex: number;
    learningObjectives?: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.bibleLesson.create({
      data,
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'CREATE_BIBLE_LESSON',
        resource: 'BibleLesson',
        resourceId: result.id,
        details: `Created lesson: ${data.title}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async updateLesson(id: string, data: {
    title?: string;
    description?: string;
    orderIndex?: number;
    learningObjectives?: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.bibleLesson.update({
      where: { id },
      data,
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'UPDATE_BIBLE_LESSON',
        resource: 'BibleLesson',
        resourceId: id,
        details: JSON.stringify(data),
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async deleteLesson(id: string, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.bibleLesson.delete({
      where: { id },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'DELETE_BIBLE_LESSON',
        resource: 'BibleLesson',
        resourceId: id,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  /**
   * Candidate Lesson Progress Tracking
   */
  async logLessonCompletion(data: {
    candidateId: string;
    lessonId: string;
    completionDate?: Date;
    understandingScore?: number;
    instructorNotes?: string;
    nextLessonDate?: Date;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const { candidateId, lessonId, ...rest } = data;

    // Upsert to handle both first-time logging and updates
    const result = await prisma.candidateLesson.upsert({
      where: {
        candidateId_lessonId: {
          candidateId,
          lessonId,
        },
      },
      update: rest,
      create: {
        candidateId,
        lessonId,
        ...rest,
      },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'LOG_LESSON_COMPLETION',
        resource: 'CandidateLesson',
        resourceId: result.id,
        details: `Logged completion for lesson ${lessonId}. Score: ${data.understandingScore}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getCandidateProgress(candidateId: string) {
    const totalLessons = await prisma.bibleLesson.count();
    const completedLessonsCount = await prisma.candidateLesson.count({
      where: {
        candidateId,
        completionDate: { not: null },
      },
    });

    const completedLessons = await prisma.candidateLesson.findMany({
      where: { candidateId },
      include: { lesson: true },
      orderBy: { lesson: { orderIndex: 'asc' } },
    });

    const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

    return {
      candidateId,
      totalLessons,
      completedLessonsCount,
      progressPercentage,
      completedLessons,
    };
  }

  async getCandidateLesson(candidateId: string, lessonId: string) {
    return prisma.candidateLesson.findUnique({
      where: {
        candidateId_lessonId: {
          candidateId,
          lessonId,
        },
      },
      include: { lesson: true },
    });
  }
}
