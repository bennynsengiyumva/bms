import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';

const auditService = new AuditService();

export class AuditController {
  async getLogs(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const { resource, action, startDate, endDate } = req.query;

      const filters: any = {};
      if (resource) filters.resource = resource as string;
      if (action) filters.action = action as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      // Scoping: church admins only see their own church logs if possible
      // However, audit logs might need more granular filtering. 
      // For now, let's just implement a basic fetch.
      
      const logs = await auditService.getLogs(filters);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
