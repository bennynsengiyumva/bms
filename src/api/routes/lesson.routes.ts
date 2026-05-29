import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const lessonController = new LessonController();

// Lesson Catalog Management
// Anyone authenticated can view lessons
router.get('/', authenticate, lessonController.getAllLessons);
router.get('/:id', authenticate, lessonController.getLesson);

// Only admins can modify the catalog
router.post('/', authenticate, authorize(['union_admin', 'field_admin']), lessonController.createLesson);
router.patch('/:id', authenticate, authorize(['union_admin', 'field_admin']), lessonController.updateLesson);
router.delete('/:id', authenticate, authorize(['union_admin', 'field_admin']), lessonController.deleteLesson);

// Progress Tracking
// Instructors and admins can log completion
router.post('/candidate/:candidateId/log', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin', 'instructor']), lessonController.logCompletion);

// Candidate can view their own progress, instructors and admins can view any candidate's progress
router.get('/candidate/:candidateId/progress', authenticate, lessonController.getProgress);

export default router;
