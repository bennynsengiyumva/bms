import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { LessonService } from '../services/lesson.service';
import { ScopeService } from '../services/scope.service';

const lessonService = new LessonService();
const scopeService = new ScopeService();

export class LessonController {
  // Catalog Management
  async getAllLessons(req: Request, res: Response) {
    try {
      const lessons = await lessonService.getAllLessons();
      res.json(lessons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getLesson(req: Request, res: Response) {
    try {
      const lesson = await lessonService.getLessonById(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      res.json(lesson);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createLesson(req: AuthRequest, res: Response) {
    try {
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const lesson = await lessonService.createLesson(req.body, context);
      res.status(201).json(lesson);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateLesson(req: AuthRequest, res: Response) {
    try {
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const lesson = await lessonService.updateLesson(req.params.id, req.body, context);
      res.json(lesson);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteLesson(req: AuthRequest, res: Response) {
    try {
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      await lessonService.deleteLesson(req.params.id, context);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Progress Tracking
  async logCompletion(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;
      
      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const { lessonId, completionDate, understandingScore, instructorNotes, nextLessonDate } = req.body;
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      
      const result = await lessonService.logLessonCompletion({
        candidateId,
        lessonId,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        understandingScore,
        instructorNotes,
        nextLessonDate: nextLessonDate ? new Date(nextLessonDate) : undefined,
      }, context);
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProgress(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const progress = await lessonService.getCandidateProgress(candidateId);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
