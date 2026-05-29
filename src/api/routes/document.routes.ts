import { Router } from 'express';
import * as documentController from '../controllers/document.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Documents
router.post('/', authenticate, documentController.uploadDocument);
router.get('/candidate/:candidateId', authenticate, documentController.getCandidateDocuments);
router.post('/log-access', authenticate, documentController.logAccess);

// Certificate Templates
router.post('/templates', authenticate, authorize(['union_admin', 'church_admin']), documentController.createTemplate);
router.get('/templates', authenticate, documentController.getTemplates);
router.get('/templates/:id', authenticate, documentController.getTemplateById);
router.patch('/templates/:id', authenticate, authorize(['union_admin', 'church_admin']), documentController.updateTemplate);

// Certificate Generation
router.post('/generate-certificate', authenticate, documentController.generateCertificateData);

export default router;
