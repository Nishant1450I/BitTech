import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseConnection();

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'ok' : 'degraded',
    service: 'dead-infrastructure-mapper-api',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
