import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { validateBody, validateQuery } from '../middleware/validation';
import {
  createReportSchema,
  createVerificationSchema,
  queryReportSchema,
  updateReportSchema,
} from '../schemas/reportSchema';

const router = Router();

router.get(
  '/',
  validateQuery(queryReportSchema),
  reportController.getAll.bind(reportController)
);

router.get(
  '/:id',
  reportController.getById.bind(reportController)
);

router.post(
  '/',
  validateBody(createReportSchema),
  reportController.create.bind(reportController)
);

router.patch(
  '/:id',
  validateBody(updateReportSchema),
  reportController.update.bind(reportController)
);

router.post(
  '/:id/verify',
  validateBody(createVerificationSchema),
  reportController.addVerification.bind(reportController)
);

export default router;
