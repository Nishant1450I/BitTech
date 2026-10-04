import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';

export class AIController {
  async analyzeReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description, infrastructureType } = req.body;
      const result = await aiService.analyzeInfrastructureReport(description, infrastructureType);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async classifyIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description } = req.body;
      const result = await aiService.classifyInfrastructureIssue(description);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async summarizeReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description } = req.body;
      const result = await aiService.summarizeInfrastructureReport(description);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
