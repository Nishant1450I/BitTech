import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

// Area comparison
router.get('/compare', analyticsController.compareAreas.bind(analyticsController));

// Area specific Reality Score breakdown
router.get('/:areaId', analyticsController.getRealityScore.bind(analyticsController));

export default router;
