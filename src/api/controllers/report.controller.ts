import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export class ReportController {
  async getBaptismStats(req: AuthRequest, res: Response) {
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

      const stats = await reportService.getBaptismStats(filters);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCandidateProgress(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.user = { churchId: user.churchId };
      } else if (user?.role === 'district_admin') {
        filters.user = { districtId: user.districtId };
      } else if (user?.role === 'field_admin') {
        filters.user = { fieldId: user.fieldId };
      } else if (user?.role === 'union_admin') {
        filters.user = { unionId: user.unionId };
      }

      const stats = await reportService.getCandidateProgress(filters);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getChurchComparison(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'district_admin') {
        filters.districtId = user.districtId;
      } else if (user?.role === 'field_admin') {
        filters.district = { fieldId: user.fieldId };
      } else if (user?.role === 'union_admin') {
        filters.district = { field: { unionId: user.unionId } };
      } else if (user?.role === 'church_admin') {
        filters.id = user.churchId;
      }

      const metrics = await reportService.getChurchMetrics(filters);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGrowthAnalytics(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.currentChurchId = user.churchId;
      } else if (user?.role === 'district_admin') {
        filters.church = { districtId: user.districtId };
      } else if (user?.role === 'field_admin') {
        filters.church = { district: { fieldId: user.fieldId } };
      } else if (user?.role === 'union_admin') {
        filters.church = { district: { field: { unionId: user.unionId } } };
      }

      const analytics = await reportService.getGrowthAnalytics(filters);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
