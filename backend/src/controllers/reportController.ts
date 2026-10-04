import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService';
import { QueryReportInput } from '../schemas/reportSchema';

export class ReportController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reportService.getAll(req.query as unknown as QueryReportInput);
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
      const item = await reportService.getById(id);
      if (!item) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Report with ID ${id} was not found.`,
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
      const created = await reportService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Report submitted successfully',
        data: {
          id: created.id,
          status: created.status,
          infrastructureId: created.infrastructureId,
          areaId: created.areaId,
          createdAt: created.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await reportService.update(id, req.body);
      if (!updated) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Report with ID ${id} was not found.`,
          },
        });
        return;
      }
      res.json({
        success: true,
        message: 'Report updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async addVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const verification = await reportService.addVerification(id, req.body);
      if (!verification) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Report with ID ${id} was not found.`,
          },
        });
        return;
      }
      res.status(201).json({
        success: true,
        message: 'Verification recorded successfully',
        data: verification,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
