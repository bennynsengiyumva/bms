import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const auditController = new AuditController();

router.get(
  '/logs',
  authenticate,
  authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']),
  (req, res) => auditController.getLogs(req, res)
);

export default router;
