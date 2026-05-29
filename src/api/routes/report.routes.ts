import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const reportController = new ReportController();

const reportRoles = [
  'union_admin',
  'field_admin',
  'district_admin',
  'church_admin',
  'pastor',
];

router.get(
  '/baptism-stats',
  authenticate,
  authorize(reportRoles),
  (req, res) => reportController.getBaptismStats(req, res)
);

router.get(
  '/candidate-progress',
  authenticate,
  authorize(reportRoles),
  (req, res) => reportController.getCandidateProgress(req, res)
);

router.get(
  '/church-comparison',
  authenticate,
  authorize(reportRoles),
  (req, res) => reportController.getChurchComparison(req, res)
);

router.get(
  '/growth-analytics',
  authenticate,
  authorize(reportRoles),
  (req, res) => reportController.getGrowthAnalytics(req, res)
);

export default router;
