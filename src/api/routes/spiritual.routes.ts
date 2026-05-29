import { Router } from 'express';
import { SpiritualController } from '../controllers/spiritual.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const spiritualController = new SpiritualController();

// Spiritual Growth Logs
router.post('/candidate/:candidateId/logs', authenticate, spiritualController.logGrowth);
router.get('/candidate/:candidateId/logs', authenticate, spiritualController.getLogs);
router.patch('/logs/:id', authenticate, spiritualController.updateLog);
router.delete('/logs/:id', authenticate, spiritualController.deleteLog);

// Baptism Interviews
router.post('/candidate/:candidateId/interviews', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor']), spiritualController.scheduleInterview);
router.get('/candidate/:candidateId/interviews', authenticate, spiritualController.getInterviews);
router.get('/interviews/:id', authenticate, spiritualController.getInterview);
router.patch('/interviews/:id', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor']), spiritualController.recordResult);

export default router;
