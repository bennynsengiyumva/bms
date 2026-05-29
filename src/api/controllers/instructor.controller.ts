import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { InstructorService } from '../services/instructor.service';
import { ScopeService } from '../services/scope.service';

const instructorService = new InstructorService();
const scopeService = new ScopeService();

export class InstructorController {
  async getInstructors(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.churchId = user.churchId;
      } else if (user?.role === 'district_admin') {
        filters.districtId = user.districtId;
      } else if (user?.role === 'field_admin') {
        filters.fieldId = user.fieldId;
      } else if (user?.role === 'union_admin') {
        filters.unionId = user.unionId;
      }

      const instructors = await instructorService.getInstructors(filters);
      res.json(instructors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInstructor(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', id);
      if (!isAuthorized) {
          return res.status(403).json({ error: 'Access denied: Instructor out of scope' });
      }

      const instructor = await instructorService.getInstructorById(id);
      if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
      res.json(instructor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', id);
      if (!isAuthorized) {
          return res.status(403).json({ error: 'Access denied: Instructor out of scope' });
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const profile = await instructorService.updateProfile(id, req.body, context);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async addTraining(req: AuthRequest, res: Response) {
    try {
      const { instructorProfileId } = req.params;
      
      // Jurisdiction check using InstructorProfile resource type
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'InstructorProfile', instructorProfileId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Instructor profile out of scope' });
      }
      
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const training = await instructorService.addTraining(instructorProfileId, req.body, context);
      res.status(201).json(training);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMetrics(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', id);
      if (!isAuthorized) {
          return res.status(403).json({ error: 'Access denied: Instructor out of scope' });
      }

      const metrics = await instructorService.getInstructorMetrics(id);
      res.json(metrics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async logCommunication(req: AuthRequest, res: Response) {
    try {
      const { recipientId, subject, content } = req.body;
      
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const log = await instructorService.logCommunication({
        senderId: req.user!.userId,
        recipientId,
        subject,
        content,
      }, context);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCommunications(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const targetUserId = id || req.user!.userId;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', targetUserId);
      if (!isAuthorized) {
          return res.status(403).json({ error: 'Access denied: User out of scope' });
      }

      const logs = await instructorService.getCommunications(targetUserId);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
