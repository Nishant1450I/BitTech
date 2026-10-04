import { Router } from 'express';
import { infrastructureController } from '../controllers/infrastructureController';
import { validateBody, validateQuery } from '../middleware/validation';
import {
  createInfrastructureSchema,
  queryInfrastructureSchema,
  updateInfrastructureSchema,
} from '../schemas/infrastructureSchema';

const router = Router();

router.get(
  '/',
  validateQuery(queryInfrastructureSchema),
  infrastructureController.getAll.bind(infrastructureController)
);

router.get(
  '/:id',
  infrastructureController.getById.bind(infrastructureController)
);

router.post(
  '/',
  validateBody(createInfrastructureSchema),
  infrastructureController.create.bind(infrastructureController)
);

router.patch(
  '/:id',
  validateBody(updateInfrastructureSchema),
  infrastructureController.update.bind(infrastructureController)
);

router.delete(
  '/:id',
  infrastructureController.delete.bind(infrastructureController)
);

export default router;
