import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { validateBody } from '../middleware/validation';
import {
  analyzeReportRequestSchema,
  classifyIssueRequestSchema,
  summarizeReportRequestSchema,
} from '../schemas/aiSchema';

const router = Router();

router.post(
  '/analyze-report',
  validateBody(analyzeReportRequestSchema),
  aiController.analyzeReport.bind(aiController)
);

router.post(
  '/classify-issue',
  validateBody(classifyIssueRequestSchema),
  aiController.classifyIssue.bind(aiController)
);

router.post(
  '/summarize-report',
  validateBody(summarizeReportRequestSchema),
  aiController.summarizeReport.bind(aiController)
);

export default router;
