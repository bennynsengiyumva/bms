import { Router } from 'express';
import * as candidateController from '../controllers/candidate.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authenticate, authorize(['church_admin', 'pastor', 'union_admin']), candidateController.register);
router.get('/', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor', 'instructor']), candidateController.getCandidates);
router.get('/:id', authenticate, candidateController.getCandidate);
router.patch('/:id', authenticate, authorize(['church_admin', 'pastor', 'union_admin']), candidateController.update);
router.post('/:id/assign-instructor', authenticate, authorize(['church_admin', 'pastor', 'union_admin']), candidateController.assignInstructor);
router.patch('/:id/status', authenticate, authorize(['church_admin', 'pastor', 'instructor', 'union_admin']), candidateController.updateStatus);

export default router;
