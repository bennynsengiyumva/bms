import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DocumentService } from '../services/document.service';
import { ScopeService } from '../services/scope.service';

const documentService = new DocumentService();
const scopeService = new ScopeService();

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const context = { executorId: req.user?.userId, ipAddress: req.ip };
    const document = await documentService.uploadDocument(req.body, context);
    res.status(201).json(document);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCandidateDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId } = req.params;

    // Jurisdiction check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Candidate', candidateId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied: Candidate out of scope' });
    }

    const documents = await documentService.getCandidateDocuments(candidateId);
    res.json(documents);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logAccess = async (req: AuthRequest, res: Response) => {
  try {
    const context = { executorId: req.user?.userId, ipAddress: req.ip };
    const log = await documentService.logAccess({
      ...req.body,
      userId: req.user?.userId
    }, context);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const context = { executorId: req.user?.userId, ipAddress: req.ip };
    const template = await documentService.createTemplate({
      ...req.body,
      userId: req.user!.userId
    }, context);
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const context = { executorId: req.user?.userId, ipAddress: req.ip };
    const template = await documentService.updateTemplate(id, {
      ...req.body,
      userId: req.user!.userId
    }, context);
    res.json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const templates = await documentService.getTemplates(type as string);
    res.json(templates);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await documentService.getTemplateById(id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const generateCertificateData = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.body; // type: 'baptism' or 'membership', id: candidateId or memberId
    // In a real system, this would fetch all data needed for the certificate
    // and maybe merge it with a template content.
    // For now, we return structured data.
    res.json({
      message: 'Certificate data generated',
      type,
      data: {
        // placeholder for actual data fetch logic
        id,
        timestamp: new Date(),
        officialSeal: 'BMS-VALIDATED'
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};