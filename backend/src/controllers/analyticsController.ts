import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  async getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getOverview();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getStatusBreakdown();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getTypesBreakdown();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 14;
      const data = await analyticsService.getTimeline(days);
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAreas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getAreasAnalytics();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRealityScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { areaId } = req.params;
      const data = await analyticsService.getAreaRealityScore(areaId);
      if (!data) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Area with ID ${areaId} was not found.`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async compareAreas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.compareAreas();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
