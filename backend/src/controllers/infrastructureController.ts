import { Request, Response, NextFunction } from 'express';
import { infrastructureService } from '../services/infrastructureService';
import { QueryInfrastructureInput } from '../schemas/infrastructureSchema';

export class InfrastructureController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await infrastructureService.getAll(req.query as unknown as QueryInfrastructureInput);
      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const item = await infrastructureService.getById(id);
      if (!item) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Infrastructure asset with ID ${id} was not found.`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await infrastructureService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Infrastructure asset registered successfully',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await infrastructureService.update(id, req.body);
      if (!updated) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Infrastructure asset with ID ${id} was not found.`,
          },
        });
        return;
      }
      res.json({
        success: true,
        message: 'Infrastructure asset updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await infrastructureService.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Infrastructure asset with ID ${id} was not found.`,
          },
        });
        return;
      }
      res.json({
        success: true,
        message: 'Infrastructure asset deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const infrastructureController = new InfrastructureController();
