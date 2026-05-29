import { Router } from 'express';
import * as churchController from '../controllers/church.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Hierarchy
router.get('/hierarchy', authenticate, churchController.getHierarchy);

// Unions
router.get('/unions', authenticate, churchController.getUnions);
router.post('/unions', authenticate, authorize(['union_admin']), churchController.createUnion);

// Fields
router.get('/fields', authenticate, churchController.getFields);
router.post('/fields', authenticate, authorize(['union_admin']), churchController.createField);

// Districts
router.get('/districts', authenticate, churchController.getDistricts);
router.post('/districts', authenticate, authorize(['union_admin', 'field_admin']), churchController.createDistrict);

// Local Churches
router.get('/churches', authenticate, churchController.getChurches);
router.post('/churches', authenticate, authorize(['union_admin', 'field_admin', 'district_admin']), churchController.createChurch);

// Coordination Meetings
router.get('/meetings', authenticate, churchController.getMeetings);
router.post('/meetings', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']), churchController.createMeeting);

// Announcements
router.get('/announcements', authenticate, churchController.getAnnouncements);
router.post('/announcements', authenticate, authorize(['union_admin', 'field_admin', 'district_admin', 'church_admin']), churchController.createAnnouncement);

// Stats
router.get('/stats', authenticate, churchController.getRegionalStats);

// Communication
router.post('/messages', authenticate, churchController.sendMessage);
router.get('/messages', authenticate, churchController.getMyMessages);

export default router;
