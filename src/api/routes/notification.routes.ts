import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Notifications
router.get('/', authenticate, notificationController.getNotifications);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);

// Templates
router.get('/templates', authenticate, notificationController.getTemplates);
router.post('/templates', authenticate, authorize(['union_admin', 'field_admin']), notificationController.createTemplate);
router.patch('/templates/:id', authenticate, authorize(['union_admin', 'field_admin']), notificationController.updateTemplate);
router.delete('/templates/:id', authenticate, authorize(['union_admin', 'field_admin']), notificationController.deleteTemplate);

// Broadcast
router.post('/broadcast', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']), notificationController.broadcast);

export default router;
