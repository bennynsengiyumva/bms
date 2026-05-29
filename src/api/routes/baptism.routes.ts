import { Router } from 'express';
import { BaptismController } from '../controllers/baptism.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const baptismController = new BaptismController();

// Events
router.get('/events', authenticate, baptismController.getEvents);
router.get('/events/:id', authenticate, baptismController.getEvent);
router.post('/events', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor']), baptismController.createEvent);

// Records
router.get('/records', authenticate, baptismController.getRecords);
router.post('/records', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor']), baptismController.recordBaptism);
router.post('/records/:id/sign', authenticate, authorize(['pastor']), baptismController.signRecord);
router.get('/records/:id/certificate', authenticate, baptismController.getCertificate);

export default router;
