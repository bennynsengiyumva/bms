import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { SpiritualService } from '../services/spiritual.service';
import { ScopeService } from '../services/scope.service';

const spiritualService = new SpiritualService();
const scopeService = new ScopeService();

export class SpiritualController {
  // Logs
  async logGrowth(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const { logType, content } = req.body;
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const log = await spiritualService.logSpiritualGrowth({
        candidateId,
        logType,
        content,
      }, context);

      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLogs(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const logs = await spiritualService.getCandidateLogs(candidateId);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateLog(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      // We assume updating logs is only allowed for the author (instructor/pastor)
      // or scoped admins. For now, check if the log's candidate is in scope.
      const logData = await spiritualService.getLogById(id);
      if (logData) {
        const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', logData.candidateId);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied: Resource out of scope' });
        }
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const log = await spiritualService.updateLog(id, req.body, context);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteLog(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const logData = await spiritualService.getLogById(id);
      if (logData) {
        const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', logData.candidateId);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied: Resource out of scope' });
        }
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      await spiritualService.deleteLog(id, context);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Interviews
  async scheduleInterview(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const { interviewerId, interviewDate } = req.body;
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const interview = await spiritualService.scheduleInterview({
        candidateId,
        interviewerId,
        interviewDate: new Date(interviewDate),
      }, context);

      res.status(201).json(interview);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async recordResult(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Check scope of the candidate in the interview
      const interviewData = await spiritualService.getInterviewById(id);
      if (interviewData) {
        const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', interviewData.candidateId);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
        }
      }

      const { readinessScore, feedback, isReady } = req.body;
      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const interview = await spiritualService.recordInterviewResult(id, {
        readinessScore,
        feedback,
        isReady,
      }, context);

      res.json(interview);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getInterviews(req: AuthRequest, res: Response) {
    try {
      const { candidateId } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const interviews = await spiritualService.getCandidateInterviews(candidateId);
      res.json(interviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInterview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const interview = await spiritualService.getInterviewById(id);
      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', interview.candidateId);
      if (!isAuthorized) {
          return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      res.json(interview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
