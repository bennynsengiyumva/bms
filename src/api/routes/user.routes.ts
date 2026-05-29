import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']), userController.getUsers);
router.get('/profile', authenticate, userController.getUserProfile);
router.get('/audit-logs', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']), userController.getAuditLogs);
router.get('/security-status', authenticate, authorize(['union_admin']), userController.getSecurityStatus);
router.patch('/:id', authenticate, userController.updateUser);
router.patch('/:id/role', authenticate, authorize(['union_admin', 'field_admin']), userController.updateUserRole);

export default router;
