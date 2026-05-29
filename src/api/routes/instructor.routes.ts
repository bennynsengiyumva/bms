import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const instructorController = new InstructorController();

const adminRoles = ['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor'];

// Instructors
router.get('/', authenticate, instructorController.getInstructors);
router.get('/:id', authenticate, instructorController.getInstructor);
router.patch('/:id/profile', authenticate, authorize([...adminRoles, 'instructor']), instructorController.updateProfile);
router.post('/profile/:instructorProfileId/training', authenticate, authorize(adminRoles), instructorController.addTraining);
router.get('/:id/metrics', authenticate, instructorController.getMetrics);

// Communications
router.post('/communications', authenticate, instructorController.logCommunication);
router.get('/communications/:id', authenticate, instructorController.getCommunications);

export default router;
