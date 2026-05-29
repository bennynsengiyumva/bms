import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { BaptismService } from '../services/baptism.service';
import { AuditService } from '../services/audit.service';
import { ScopeService } from '../services/scope.service';

const baptismService = new BaptismService();
const auditService = new AuditService();
const scopeService = new ScopeService();

export class BaptismController {
  /**
   * Events
   */
  async createEvent(req: AuthRequest, res: Response) {
    try {
      const { churchId, eventDate, location, officiatingPastorId } = req.body;
      
      // Enforce scoping for church admins/pastors
      if (req.user?.role === 'church_admin' || req.user?.role === 'pastor') {
        if (churchId !== req.user.churchId) {
            return res.status(403).json({ error: 'Access denied: Cannot create event for another church' });
        }
      }
      
      const context = { executorId: req.user?.userId, ipAddress: req.ip };
      const event = await baptismService.createEvent({
        churchId,
        eventDate: new Date(eventDate),
        location,
        officiatingPastorId
      }, context);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEvents(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.churchId = user.churchId;
      } else if (user?.role === 'district_admin') {
        filters.church = { districtId: user.districtId };
      } else if (user?.role === 'field_admin') {
        filters.church = { district: { fieldId: user.fieldId } };
      } else if (user?.role === 'union_admin') {
        filters.church = { district: { field: { unionId: user.unionId } } };
      }

      const events = await baptismService.getEvents(filters);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEvent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'BaptismEvent', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }

      const event = await baptismService.getEventById(id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Records
   */
  async recordBaptism(req: AuthRequest, res: Response) {
    try {
      const { eventId, candidateId, witnessName, sponsorName, certificateNumber } = req.body;

      // Jurisdiction check for event
      const isEventAuthorized = await scopeService.checkScope(req.user!.userId, 'BaptismEvent', eventId);
      if (!isEventAuthorized) {
        return res.status(403).json({ error: 'Access denied: Event out of scope' });
      }

      // Jurisdiction check for candidate
      const isCandidateAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
      if (!isCandidateAuthorized) {
        return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
      }

      const context = { executorId: req.user?.userId, ipAddress: req.ip };
      const record = await baptismService.recordBaptism({
        eventId,
        candidateId,
        witnessName,
        sponsorName,
        certificateNumber
      }, context);
      res.status(201).json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getRecords(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.event = { churchId: user.churchId };
      } else if (user?.role === 'district_admin') {
        filters.event = { church: { districtId: user.districtId } };
      } else if (user?.role === 'field_admin') {
        filters.event = { church: { district: { fieldId: user.fieldId } } };
      } else if (user?.role === 'union_admin') {
        filters.event = { church: { district: { field: { unionId: user.unionId } } } };
      }

      const records = await baptismService.getRecords(filters);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signRecord(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pastorId = req.user!.userId;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'BaptismRecord', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }
      
      const context = { executorId: pastorId, ipAddress: req.ip };
      const record = await baptismService.signRecord(id, pastorId, context);
      
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCertificate(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'BaptismRecord', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }

      const data = await baptismService.generateCertificateData(id);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
