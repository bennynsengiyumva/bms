import type { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as candidateService from '../services/candidate.service';
import { ScopeService } from '../services/scope.service';

const scopeService = new ScopeService();

export const register = async (req: AuthRequest, res: Response) => {
  try {
    // Enforce scoping for church admins
    if (req.user?.role === 'church_admin') {
      req.body.churchId = req.user.churchId;
    } else if (req.user?.role === 'district_admin') {
      req.body.districtId = req.user.districtId;
    }

    const context = { executorId: req.user?.userId, ipAddress: req.ip };
    const candidate = await candidateService.registerCandidate(req.body, context);
    res.status(201).json(candidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    
    // Hierarchical access control
    if (req.user?.role === 'church_admin') {
      filters.user = { churchId: req.user.churchId };
    } else if (req.user?.role === 'district_admin') {
      filters.user = { districtId: req.user.districtId };
    } else if (req.user?.role === 'field_admin') {
      filters.user = { fieldId: req.user.fieldId };
    } else if (req.user?.role === 'instructor') {
      filters.instructorId = req.user.userId;
    }

    const candidates = await candidateService.getAllCandidates(filters);
    res.status(200).json(candidates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Jurisdiction check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', id);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied: Resource out of scope' });
    }

    const candidate = await candidateService.getCandidateById(id);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(200).json(candidate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Jurisdiction check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', id);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied: Resource out of scope' });
    }

    const context = { executorId: req.user!.userId, ipAddress: req.ip };
    const candidate = await candidateService.updateCandidate(id, req.body, context);
    res.status(200).json(candidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const assignInstructor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { instructorId } = req.body;

    // Jurisdiction check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', id);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied: Resource out of scope' });
    }

    const context = { executorId: req.user!.userId, ipAddress: req.ip };
    const candidate = await candidateService.assignInstructor(id, instructorId, context);
    res.status(200).json(candidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Jurisdiction check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', id);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied: Resource out of scope' });
    }

    const context = { executorId: req.user!.userId, ipAddress: req.ip };
    const candidate = await candidateService.updateCandidateStatus(id, status, context);
    res.status(200).json(candidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
