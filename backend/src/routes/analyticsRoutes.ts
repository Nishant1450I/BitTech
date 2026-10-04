import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

router.get('/overview', analyticsController.getOverview.bind(analyticsController));
router.get('/status', analyticsController.getStatus.bind(analyticsController));
router.get('/types', analyticsController.getTypes.bind(analyticsController));
router.get('/timeline', analyticsController.getTimeline.bind(analyticsController));
router.get('/areas', analyticsController.getAreas.bind(analyticsController));
router.get('/compare', analyticsController.compareAreas.bind(analyticsController));

export default router;
